import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import productsRouter from './routes/products.js';
import { ordersRouter } from './routes/orders.js';
import { usersRouter } from './routes/users.js';
import { authRouter } from './routes/auth.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/static', express.static(path.join(__dirname, '..', 'frontend')));

app.get('/', (req, res) => {
  res.send('Server is ready');
});
app.get('/health', (req, res) => {
  res.json({ ok: true });
});
app.get('/select', (req, res) => {
  res.render('pages/select');
});
app.get('/art', (req, res) => {
  res.render('pages/art');
});
app.get('/study', (req, res) => {
  res.render('pages/study');
});
app.get('/order', (req, res) => {
  res.render('pages/order');
});
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

const port = process.env.PORT || 3000;

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('Startup error: Missing MONGODB_URI in .env');
  process.exit(1);
}
mongoose.set('strictQuery', true);
mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(port, () => {
      console.log(`Server at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message || err);
    console.error('Check that your IP is whitelisted in Atlas and the username/password/DB match .env');
    process.exit(1);
  });