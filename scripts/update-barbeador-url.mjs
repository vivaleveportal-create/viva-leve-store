import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

async function updateBarbeador() {
    try {
        const dbName = process.env.MONGODB_DB_NAME || 'VivaLevePortal';
        const uri = `${process.env.MONGODB_URI}${dbName}?retryWrites=true&w=majority`;
        
        console.log(`📡 Conectando ao Banco: ${dbName}...`);
        await mongoose.connect(uri);
        console.log('✅ Conectado!');

        const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({
            slug: String,
            coinzz_url: String
        }, { collection: 'products' }));

        const result = await Product.updateOne(
            { slug: 'barbeador-eletrico-3-em-1' },
            { $set: { coinzz_url: 'https://app.coinzz.com.br/checkout/barbeador-multifuncional-3-em-1-0' } }
        );

        console.log(`🔹 Produto Barbeador: ${result.modifiedCount} atualizado(s)`);
        console.log('✨ Sincronização concluída!');
    } catch (error) {
        console.error('❌ Erro durante a sincronização:', error);
    } finally {
        await mongoose.disconnect();
    }
}

updateBarbeador();
