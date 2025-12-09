import connectDB from '../db.js';
import Order from '../../backend/models/Order.js';
import jwt from 'jsonwebtoken';
import User from '../../backend/models/User.js';

async function protect(req) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new Error('Not authorized, no token');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password');
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB();
    const user = await protect(req);
    const { id } = req.query;

    if (req.method === 'GET') {
      const order = await Order.findById(id)
        .populate('user', 'name email')
        .populate('orderItems.product');

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Check if user owns the order or is admin
      if (order.user._id.toString() !== user._id.toString() && user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
      }

      return res.json(order);
    }

    // PUT is handled by nested routes: /pay and /deliver
    if (req.method === 'PUT') {
      return res.status(400).json({ message: 'Use /api/orders/:id/pay or /api/orders/:id/deliver' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Order error:', error);
    if (error.message.includes('Not authorized')) {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
}

