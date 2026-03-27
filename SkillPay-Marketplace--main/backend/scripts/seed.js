import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadJSON(relPath) {
  const p = path.join(__dirname, '..', '..', 'frontend', relPath);
  try {
    const data = await fs.readFile(p, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Seed error: Failed to load JSON ${relPath} at ${p}:`, err.message || err);
    throw err;
  }
}

async function run() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('Seed error: Missing MONGODB_URI in .env');
      process.exit(1);
    }
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log('MongoDB connected for seeding');

    const art = await loadJSON('art-products.json');
    const study = await loadJSON('study-products.json');
    console.log('Loaded art categories:', Object.keys(art).join(', '));
    console.log('Loaded study categories:', Object.keys(study).join(', '));

    const docs = [];
    let artCount = 0;
    for (const [category, items] of Object.entries(art)) {
      artCount += items.length;
      for (const item of items) {
        if (!item.id || !item.name || item.price == null || !item.image) {
          console.warn('Skipping invalid art item:', item);
          continue;
        }
        const id = `art_${item.id}`;
        docs.push({ id, name: item.name, price: Number(item.price), image: item.image, section: 'art', category, rating: item.rating, reviews: item.reviews });
      }
    }
    let studyCount = 0;
    for (const [category, items] of Object.entries(study)) {
      studyCount += items.length;
      for (const item of items) {
        if (!item.id || !item.name || item.price == null || !item.image) {
          console.warn('Skipping invalid study item:', item);
          continue;
        }
        const id = `study_${item.id}`;
        docs.push({ id, name: item.name, price: Number(item.price), image: item.image, section: 'study', category, rating: item.rating, reviews: item.reviews });
      }
    }
    console.log(`Prepared ${docs.length} products (art: ${artCount}, study: ${studyCount})`);

    try { await Product.collection.createIndex({ id: 1 }, { unique: true }); } catch {}

    await Product.deleteMany({});
    await Product.insertMany(docs);
    console.log(`Seeded ${docs.length} products`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message || err);
    process.exit(1);
  }
}

run();