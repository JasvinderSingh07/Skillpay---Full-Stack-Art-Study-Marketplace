import Order from '../models/Order.js';

export async function create(req, res) {
  const body = req.body || {};
  const c = body.customer || {};
  const items = Array.isArray(body.items) ? body.items : [];
  if (!c.name || !c.phone || !c.address || items.length === 0) {
    return res.status(400).json({ error: 'Invalid order payload' });
  }
  const subtotal = items.reduce((s, i) => s + Number(i.price) * Number(i.qty || 1), 0);
  const discountRate = 0.08;
  const shipping = 40;
  const discount = subtotal * discountRate;
  const total = subtotal > 0 ? subtotal - discount + shipping : 0;

  const order = await Order.create({
    customer: { name: c.name, phone: c.phone, email: c.email || '', address: c.address },
    items: items.map(i => ({ id: i.id, name: i.name, price: Number(i.price), image: i.image, qty: Number(i.qty || 1) })),
    subtotal, discount, shipping, total
  });
  res.status(201).json({ id: order._id, order });
}

export async function getOne(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Not found' });
  res.json(order);
}

export async function list(req, res) {
  const orders = await Order.find({}).sort({ createdAt: -1 }).limit(50);
  res.json(orders);
}