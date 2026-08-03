import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User } from '../models/user';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

const getJwtSecret = () => process.env.JWT_SECRET || 'portfolio_jwt_secret_2026';

// Pre-calculated bcrypt hash for default fallback password "admin123"
const DEFAULT_ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const DEFAULT_ADMIN_PASS_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    let isAuthenticated = false;
    let userId = 'admin-id';
    let userRole = 'admin';

    // 1. Try DB auth if Mongoose is ready
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ username });
      if (user && (await bcrypt.compare(password, user.password))) {
        isAuthenticated = true;
        userId = user._id.toString();
      }
    }

    // 2. Fallback to Admin credentials
    if (!isAuthenticated) {
      if (username === DEFAULT_ADMIN_USER && (await bcrypt.compare(password, DEFAULT_ADMIN_PASS_HASH))) {
        isAuthenticated = true;
      }
    }

    if (isAuthenticated) {
      const token = jwt.sign(
        { id: userId, username, role: userRole },
        getJwtSecret(),
        { expiresIn: '30d' }
      );

      return res.json({
        message: 'Login successful',
        token,
        user: {
          username,
          role: userRole
        }
      });
    } else {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Authentication error' });
  }
});

// Verify current session token
router.get('/me', protect, (req, res) => {
  res.json({
    user: req.user
  });
});

// Seed Initial User in Mongo if connected
router.post('/seed', async (req, res) => {
  const { username = 'admin', password = 'admin123' } = req.body;
  if (mongoose.connection.readyState !== 1) {
    return res.json({ message: 'Default admin credentials active (DB not connected).' });
  }

  const userExists = await User.findOne({ username });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  await User.create({ username, password });
  res.json({ message: 'Admin user created in MongoDB' });
});

export default router;
