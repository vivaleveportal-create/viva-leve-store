import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

async function updateProducts() {
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

        const mappings = [
            { slug: 'luminaria-mata-mosquito-uv', url: 'https://app.coinzz.com.br/checkout/luminaria-uv-mata-mosquito-0' },
            { slug: 'lixa-de-pe-eletrica-recarregavel', url: 'https://app.coinzz.com.br/checkout/lixa-eletrica-de-pe-recarregavel-0' }
        ];

        for (const mapping of mappings) {
            const result = await Product.updateOne(
                { slug: mapping.slug },
                { $set: { coinzz_url: mapping.url } }
            );
            console.log(`🔹 Produto ${mapping.slug}: ${result.modifiedCount} atualizado(s)`);
        }

        console.log('✨ Sincronização concluída!');
    } catch (error) {
        console.error('❌ Erro durante a sincronização:', error);
    } finally {
        await mongoose.disconnect();
    }
}

updateProducts();
