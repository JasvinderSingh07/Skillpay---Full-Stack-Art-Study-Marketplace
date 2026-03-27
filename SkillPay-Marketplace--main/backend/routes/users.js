import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const b = req.body || {};
    const name = String(b.name || '').trim();
    const email = String(b.email || '').toLowerCase().trim();
    const password = String(b.password || '');
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Missing required fields: name, email, password' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ success: false, error: 'Email already registered' });

    const doc = await User.create({ name, email, password });
    res.status(201).json({ success: true, user: { id: doc._id, name: doc.name, email: doc.email } });
  } catch (_) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const b = req.body || {};
    const email = String(b.email || '').toLowerCase().trim();
    const password = String(b.password || '');
    if (!email || !password) return res.status(400).json({ success: false, error: 'Missing email or password' });

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ success: false, error: 'Invalid credentials' });

    res.json({ success: true, user: { id: user._id, name: user.name, email: user.email } });
  } catch (_) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export { router as usersRouter };