import connectDB from '../db.js';
import Order from '../../backend/models/Order.js';
import Stripe from 'stripe';
import jwt from 'jsonwebtoken';
import User from '../../backend/models/User.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    const user = await protect(req);

    const { orderId } = req.body;

    const order = await Order.findById(orderId).populate('user');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (order.isPaid) {
      return res.status(400).json({ message: 'Order already paid' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order._id.toString(),
        userId: user._id.toString()
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    if (error.message.includes('Not authorized')) {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
}

