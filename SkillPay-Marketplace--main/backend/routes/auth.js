import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    const n = String(name || '').trim();
    const e = String(email || '').toLowerCase().trim();
    const p = String(password || '');
    if (!n || !e || !p) return res.status(400).json({ success: false, message: 'Missing required fields' });
    const existing = await User.findOne({ email: e });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ name: n, email: e, password: p });
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });
    res.status(201).json({ success: true, message: 'Registration successful', token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const e = String(email || '').toLowerCase().trim();
    const p = String(password || '');
    if (!e || !p) return res.status(400).json({ success: false, message: 'Missing email or password' });

    let user = await User.findOne({ email: e }).select('+password');
    if (!user) {
      const defaultName = e.split('@')[0] || 'User';
      user = await User.create({ name: defaultName, email: e, password: p });
    }
    const match = await user.comparePassword(p);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });
    res.json({ success: true, message: 'Login successful', token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
});

export { router as authRouter };