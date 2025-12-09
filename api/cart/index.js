import connectDB from '../db.js';
import Cart from '../../backend/models/Cart.js';
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB();
    const user = await protect(req);

    // GET /api/cart (get cart)
    if (req.method === 'GET') {
      let cart = await Cart.findOne({ user: user._id }).populate('items.product');
      
      if (!cart) {
        cart = await Cart.create({ user: user._id, items: [] });
      }
      
      return res.json(cart);
    }

    // POST /api/cart (add item)
    if (req.method === 'POST') {
      const { productId, quantity } = req.body;

      if (!productId || !quantity) {
        return res.status(400).json({ message: 'Product ID and quantity are required' });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      if (product.stock < quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }

      let cart = await Cart.findOne({ user: user._id });

      if (!cart) {
        cart = await Cart.create({ user: user._id, items: [] });
      }

      const existingItemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
      await cart.populate('items.product');

      return res.json(cart);
    }

    // DELETE /api/cart (clear cart)
    if (req.method === 'DELETE') {
      const cart = await Cart.findOne({ user: user._id });

      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      cart.items = [];
      await cart.save();

      return res.json({ message: 'Cart cleared successfully' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Cart error:', error);
    if (error.message.includes('Not authorized')) {
      return res.status(401).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
}

