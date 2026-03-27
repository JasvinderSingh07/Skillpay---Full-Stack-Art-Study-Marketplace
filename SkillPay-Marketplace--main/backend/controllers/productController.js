import Product from '../models/Product.js';

export async function list(req, res) {
  const products = await Product.find({});
  res.json(products);
}

export async function getOne(req, res) {
  const product = await Product.findOne({ id: req.params.id });
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json(product);
}

export async function create(req, res) {
  const product = await Product.create(req.body);
  res.status(201).json(product);
}

export async function update(req, res) {
  const product = await Product.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json(product);
}

export async function remove(req, res) {
  const result = await Product.deleteOne({ id: req.params.id });
  if (!result.deletedCount) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
}

export async function catalogArt(req, res) {
  const items = await Product.find({ section: 'art' });
  const group = {
    sketches: items.filter(i => i.category === 'sketches'),
    sculptures: items.filter(i => i.category === 'sculptures'),
    paintings: items.filter(i => i.category === 'paintings'),
    arts: items.filter(i => i.category === 'arts'),
    photographs: items.filter(i => i.category === 'photographs'),
    newArrivals: items.filter(i => i.category === 'newArrivals')
  };
  res.json(group);
}

export async function catalogStudy(req, res) {
  const items = await Product.find({ section: 'study' });
  const group = {
    courses: items.filter(i => i.category === 'courses'),
    books: items.filter(i => i.category === 'books'),
    stationery: items.filter(i => i.category === 'stationery'),
    notes: items.filter(i => i.category === 'notes'),
    journals: items.filter(i => i.category === 'journals'),
    projects: items.filter(i => i.category === 'projects')
  };
  res.json(group);
}