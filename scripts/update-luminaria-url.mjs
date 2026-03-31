import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

async function updateLuminaria() {
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
            { slug: 'luminaria-mata-mosquito-uv' },
            { $set: { coinzz_url: 'https://app.coinzz.com.br/checkout/luminaria-uv-mata-mosquito-0' } }
        );

        console.log(`🔹 Produto Luminária: ${result.modifiedCount} atualizado(s)`);
        console.log('✨ Sincronização concluída!');
    } catch (error) {
        console.error('❌ Erro durante a sincronização:', error);
    } finally {
        await mongoose.disconnect();
    }
}

updateLuminaria();
