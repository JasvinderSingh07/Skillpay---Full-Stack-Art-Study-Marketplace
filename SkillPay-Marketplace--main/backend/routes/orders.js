import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

const normalizeItems = (items) => {
  const arr = Array.isArray(items) ? items : [];
  return arr
    .filter(i => i && typeof i === 'object')
    .map(i => ({
      id: String(i.id || ''),
      name: String(i.name || ''),
      price: Number(i.price || 0),
      image: String(i.image || ''),
      qty: Number(i.qty || 1)
    }))
    .filter(i => i.id && i.name && i.price >= 0 && i.qty >= 1);
};

const computeTotals = (items) => {
  const subtotal = items.reduce((s, i) => s + Number(i.price) * Number(i.qty), 0);
  const discountRate = 0.08;
  const shipping = 40;
  const discount = subtotal * discountRate;
  const total = subtotal > 0 ? subtotal - discount + shipping : 0;
  return { subtotal, discount, shipping, total };
};

router.get('/', async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit || 50), 100);
    const orders = await Order.find({}).sort({ createdAt: -1 }).limit(limit);
    res.json({ success: true, orders });
  } catch (_) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const body = req.body || {};
    const items = normalizeItems(body.items);
    if (items.length === 0) {
      return res.status(400).json({ success: false, error: 'Items array is required and cannot be empty' });
    }

    const customer = body.customer || body.customerInfo || {};
    const name = String(customer.name || '').trim();
    const phone = String(customer.phone || '').trim();
    const address = String(customer.address || '').trim();
    const email = String(customer.email || '');
    if (!name || !phone || !address) {
      return res.status(400).json({ success: false, error: 'Missing required customer fields: name, phone, address' });
    }

    const totals = computeTotals(items);
    const orderDoc = await Order.create({
      customer: { name, phone, email, address },
      items,
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping,
      total: totals.total
    });

    res.status(201).json({ success: true, order: orderDoc, message: 'Order created' });
  } catch (_) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (_) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export { router as ordersRouter };