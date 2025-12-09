import connectDB from '../db.js';
import Product from '../../backend/models/Product.js';
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB();
    const { id } = req.query;

    if (req.method === 'GET') {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.json(product);
    }

    if (req.method === 'PUT' || req.method === 'DELETE') {
      const user = await protect(req);
      
      if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized as admin' });
      }

      if (req.method === 'PUT') {
        const product = await Product.findByIdAndUpdate(
          id,
          req.body,
          { new: true, runValidators: true }
        );

        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }

        return res.json(product);
      }

      if (req.method === 'DELETE') {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
        return res.json({ message: 'Product deleted successfully' });
      }
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Product error:', error);
    if (error.message.includes('Not authorized')) {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
}

