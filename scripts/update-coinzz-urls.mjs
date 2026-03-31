import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env' });

const productMappings = [
    { slug: 'kit-massagem-ems', url: 'https://app.coinzz.com.br/checkout/kit-massagem-ems-relaxamento-0' },
    { slug: 'mini-robo-aspirador-inteligente', url: 'https://app.coinzz.com.br/checkout/mini-robo-aspirador-pro-0' },
    { slug: 'camera-lampada-360-wi-fi', url: 'https://app.coinzz.com.br/checkout/camera-lampada-360-wi-fi-ip-0' },
    { slug: 'chaveiro-rastreador-gps-bluetooth', url: 'https://app.coinzz.com.br/checkout/chaveiro-rastreador-gps-bt-0' },
    { slug: 'caneta-depiladora-eletrica-recarregavel', url: 'https://app.coinzz.com.br/checkout/caneta-depiladora-eletrica-0' },
    { slug: 'escova-a-vapor-para-pets-3-em-1', url: 'https://app.coinzz.com.br/checkout/escova-a-vapor-para-pets-0' },
    { slug: 'modelador-termico-de-cilios-eletrico', url: 'https://app.coinzz.com.br/checkout/modelador-termico-cilios-0' },
    { slug: 'lixa-de-pe-eletrica-recarregavel', url: 'https://app.coinzz.com.br/checkout/lixa-eletrica-de-pe-0' },
    { slug: 'luminaria-mata-mosquito-uv', url: 'https://app.coinzz.com.br/checkout/luminaria-mata-mosquito-uv-0' },
    { slug: 'barbeador-eletrico-3-em-1', url: 'https://app.coinzz.com.br/checkout/barbeador-eletrico-multifuncional-3-em-1-0' },
    { slug: 'mini-camera-wi-fi-a9', url: 'https://app.coinzz.com.br/checkout/mini-camera-espia-a9-0' },
    { slug: 'fone-bluetooth-m10-com-power-bank-integrado', url: 'https://app.coinzz.com.br/checkout/fone-bluetooth-m10-0' },
];

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

        for (const mapping of productMappings) {
            const result = await Product.updateMany(
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
