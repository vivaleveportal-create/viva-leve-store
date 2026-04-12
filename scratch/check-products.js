const mongoose = require('mongoose');

async function checkProducts() {
  try {
    await mongoose.connect('mongodb://localhost:27017/viva-leve-portal');
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({
      slug: String,
      active: Boolean,
      locale: String,
      name: String
    }));
    
    const products = await Product.find({ active: true });
    console.log('Active Products:');
    products.forEach(p => console.log(`- ${p.name} (${p.slug}) [${p.locale}]`));
    
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

checkProducts();
