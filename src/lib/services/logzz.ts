/**
 * Logzz/Coinzz Service Integration
 * 
 * This service handles sending order data to Logzz for physical fulfillment.
 * Since the store uses the Coinzz network (Cash on Delivery + Upfront), 
 * we send the order as soon as payment is confirmed (Stripe) or immediately (COD).
 */

const LOGZZ_API_BASE = 'https://api.logzz.com.br/v1'; // Placeholder URL

export interface LogzzOrderData {
    customer: {
        name: string;
        email: string;
        phone: string;
        document?: string; // CPF
    };
    address: {
        zipCode: string;
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
    };
    products: Array<{
        logzzProductId: string;
        quantity: number;
        price: number;
    }>;
    externalOrderId: string;
    paymentMethod: 'credit_card' | 'pix' | 'cod';
}

export async function createLogzzOrder(data: LogzzOrderData) {
    const apiKey = process.env.LOGZZ_API_KEY;
    if (!apiKey) {
        throw new Error('LOGZZ_API_KEY is not defined');
    }

    try {
        const response = await fetch(`${LOGZZ_API_BASE}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': apiKey,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Logzz API Error: ${JSON.stringify(error)}`);
        }

        const result = await response.json();
        return result.order_id;
    } catch (error) {
        console.error('Logzz fulfillment failed:', error);
        throw error;
    }
}
