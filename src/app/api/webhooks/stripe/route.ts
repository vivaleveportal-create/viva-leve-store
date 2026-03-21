import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { connectMongo } from '@/lib/mongodb'
import OrderModel from '@/lib/models/Order'
import UserModel from '@/lib/models/User'
import { sendReceiptEmail } from '@/lib/email'
import { createLogzzOrder } from '@/lib/services/logzz'

export async function POST(req: NextRequest) {
    const body = await req.text()
    const sig = req.headers.get('stripe-signature')!

    let event
    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;
        const { orderId } = session.metadata!

        await connectMongo()

        const shipping = session.shipping_details;
        const phone = session.customer_details?.phone;
        const zipCode = shipping?.address?.postal_code?.replace(/\D/g, '');

        // Detect real payment method (pix vs card)
        const paymentMethod = session.payment_method_types?.[0] === 'pix' ? 'pix' : 'credit_card';

        // Map Stripe fields to our order schema
        const shippingAddress = shipping ? {
            street: shipping.address.line1,
            number: '', 
            complement: shipping.address.line2 || '',
            neighborhood: '', 
            city: shipping.address.city,
            state: shipping.address.state,
            zipCode: shipping.address.postal_code,
        } : undefined;

        // Problem 2: Enrich with ViaCEP for Brazilian addresses
        if (zipCode && zipCode.length === 8 && shipping?.address?.country === 'BR' && shippingAddress) {
            try {
                const viaCepRes = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`);
                const viaCepData = await viaCepRes.json();
                if (!viaCepData.erro) {
                    shippingAddress.neighborhood = viaCepData.bairro || '';
                    if (!shippingAddress.city) shippingAddress.city = viaCepData.localidade;
                    if (!shippingAddress.state) shippingAddress.state = viaCepData.uf;
                    // If street in Stripe is very short or just contains number, we might use ViaCEP's street too
                    if (shippingAddress.street.length < 5) shippingAddress.street = viaCepData.logradouro;
                }
            } catch (err) {
                console.error('ViaCEP lookup failed:', err);
            }
        }

        const orderUpdate: any = {
            status: 'paid',
            stripePaymentIntentId: session.payment_intent as string,
            shippingAddress
        };

        const order = await OrderModel.findByIdAndUpdate(
            orderId,
            orderUpdate,
            { new: true }
        ).populate('products', 'name price logzzProductId').populate('user', 'email name phone document address')

        if (order) {
            // Update User default info if missing
            if (phone || shippingAddress) {
                await UserModel.findByIdAndUpdate(order.user._id, {
                    ...(phone && !order.user.phone ? { phone } : {}),
                    ...(shippingAddress && !order.user.address ? { address: shippingAddress } : {}),
                });
            }

            // Send to Logzz for physical fulfillment
            try {
                const logzzId = await createLogzzOrder({
                    customer: {
                        name: order.user.name || shipping?.name || 'Cliente',
                        email: order.user.email,
                        phone: phone || order.user.phone || '',
                        document: order.user.document || '',
                    },
                    address: {
                        zipCode: shippingAddress?.zipCode || order.user.address?.zipCode || '',
                        street: shippingAddress?.street || order.user.address?.street || '',
                        number: shippingAddress?.number || order.user.address?.number || '',
                        complement: shippingAddress?.complement || order.user.address?.complement || '',
                        neighborhood: shippingAddress?.neighborhood || order.user.address?.neighborhood || '',
                        city: shippingAddress?.city || order.user.address?.city || '',
                        state: shippingAddress?.state || order.user.address?.state || '',
                    },
                    products: (order.products as any[]).map(p => ({
                        logzzProductId: p.logzzProductId,
                        quantity: 1,
                        price: p.price,
                    })),
                    externalOrderId: order._id.toString(),
                    paymentMethod, 
                });

                await OrderModel.findByIdAndUpdate(orderId, { logzzOrderId: logzzId, status: 'processing' });
            } catch (logzzErr) {
                // Problem 3: Robust Error Handling
                console.error('Logzz order failed for paid order:', orderId, logzzErr);
                await OrderModel.findByIdAndUpdate(orderId, { status: 'logzz_failed' });
                // Note: We could trigger a notification email to admin here in the future
            }

            // Sync receipt email
            if (!order.receiptEmailSent) {
                try {
                    await sendReceiptEmail(order.user.email, {
                        id: order._id.toString(),
                        products: (order.products as Array<{ name: string; price: number }>).map((p) => ({
                            name: p.name,
                            price: Math.round(p.price * 100),
                        })),
                        total: order.total,
                    })
                    await OrderModel.findByIdAndUpdate(orderId, { receiptEmailSent: true })
                } catch (emailErr) {
                    console.error('Receipt email failed:', emailErr)
                }
            }
        }
    }

    return NextResponse.json({ received: true })
}
