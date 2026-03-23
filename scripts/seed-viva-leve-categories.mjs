import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'minha-loja';

if (!uri) {
  console.error('MONGODB_URI is not defined in .env');
  process.exit(1);
}

const categories = [
  { label: 'Saúde e Mobilidade', value: 'saude-e-mobilidade', active: true },
  { label: 'Cuidados com a Pele', value: 'cuidados-com-a-pele', active: true },
  { label: 'Conforto e Sono', value: 'conforto-e-sono', active: true },
  { label: 'Casa e Utilidades', value: 'casa-e-utilidades', active: true },
  { label: 'Pets', value: 'pets', active: true },
  { label: 'Beleza e Cuidados Pessoais', value: 'beleza-e-cuidados-pessoais', active: true },
];

async function seed() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    const collection = db.collection('categories');

    const locales = ['pt', 'en'];
    
    console.log('Clearing existing categories...');
    await collection.deleteMany({});

    for (const locale of locales) {
      for (const cat of categories) {
        // Handle English labels for localization if needed, or keep for now
        let label = cat.label;
        if (locale === 'en') {
           if (cat.label === 'Saúde e Mobilidade') label = 'Health and Mobility';
           if (cat.label === 'Cuidados com a Pele') label = 'Skin Care';
           if (cat.label === 'Conforto e Sono') label = 'Comfort and Sleep';
           if (cat.label === 'Casa e Utilidades') label = 'Home and Utilities';
           if (cat.label === 'Pets') label = 'Pets';
           if (cat.label === 'Beleza e Cuidados Pessoais') label = 'Beauty and Personal Care';
        }

        const doc = {
          label,
          value: cat.value,
          active: cat.active,
          locale,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        await collection.insertOne(doc);
        console.log(`Seeded category: ${label} (${locale})`);
      }
    }

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding categories:', error);
  } finally {
    await client.close();
  }
}

seed();
