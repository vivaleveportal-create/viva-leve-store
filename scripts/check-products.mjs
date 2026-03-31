import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env' });

async function checkProducts() {
    try {
        const uri = `${process.env.MONGODB_URI}${process.env.MONGODB_DB_NAME}?retryWrites=true&w=majority`;
        console.log(`📡 Conectando ao banco: ${process.env.MONGODB_DB_NAME}...`);
        await mongoose.connect(uri);
        
        const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({
            name: String,
            slug: String,
            locale: String
        }, { collection: 'products' }));

        const products = await Product.find({}).lean();
        console.log(`🔍 Encontrados ${products.length} produtos.`);
        if (products.length > 0) {
            console.log(JSON.stringify(products.map(p => ({ name: p.name, slug: p.slug })), null, 2));
        } else {
            console.log('⚠️ Nenhum produto encontrado na coleção "products".');
        }
    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
}

checkProducts();
