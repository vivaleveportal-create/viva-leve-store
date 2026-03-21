import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'minha-loja';

if (!uri) {
  console.error('MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

const categories = [
  { label: 'Saúde e Mobilidade', value: 'saude-e-mobilidade', active: true },
  { label: 'Exercícios em Casa', value: 'exercicios-em-casa', active: true },
  { label: 'Cuidados com a Pele', value: 'cuidados-com-a-pele', active: true },
  { label: 'Conforto e Sono', value: 'conforto-e-sono', active: true },
  { label: 'Mente Ativa', value: 'mente-ativa', active: true },
];

async function seed() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    const collection = db.collection('categories');

    // Add for both locales if needed, or handle in the app
    const locales = ['pt', 'en'];
    
    for (const locale of locales) {
      for (const cat of categories) {
        const doc = {
          ...cat,
          locale,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        // Use upsert
        await collection.updateOne(
          { value: cat.value, locale },
          { $set: doc },
          { upsert: true }
        );
        console.log(`Seeded category: ${cat.label} (${locale})`);
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
