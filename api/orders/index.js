import connectDB from '../db.js';
import Order from '../../backend/models/Order.js';
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB();
    const user = await protect(req);

    // GET /api/orders (list orders)
    if (req.method === 'GET') {
      let orders;
      
      if (user.role === 'admin') {
        orders = await Order.find({})
          .populate('user', 'name email')
          .populate('orderItems.product')
          .sort({ createdAt: -1 });
      } else {
        orders = await Order.find({ user: user._id })
          .populate('orderItems.product')
          .sort({ createdAt: -1 });
      }

      return res.json(orders);
    }

    // POST /api/orders (create order)
    if (req.method === 'POST') {
      const { shippingAddress, paymentMethod } = req.body;

      if (!shippingAddress || !paymentMethod) {
        return res.status(400).json({ message: 'Shipping address and payment method are required' });
      }

      const cart = await Cart.findOne({ user: user._id }).populate('items.product');
      
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }

      const itemsPrice = cart.items.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
      }, 0);

      const taxPrice = itemsPrice * 0.1;
      const shippingPrice = itemsPrice > 100 ? 0 : 10;
      const totalPrice = itemsPrice + taxPrice + shippingPrice;

      const orderItems = cart.items.map(item => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.image,
        price: item.product.price,
        quantity: item.quantity
      }));

      const order = await Order.create({
        user: user._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
      });

      for (const item of cart.items) {
        await Product.findByIdAndUpdate(item.product._id, {
          $inc: { stock: -item.quantity }
        });
      }

      cart.items = [];
      await cart.save();

      await order.populate('user', 'name email');
      await order.populate('orderItems.product');

      return res.status(201).json(order);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Orders error:', error);
    if (error.message.includes('Not authorized')) {
      return res.status(401).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
}

