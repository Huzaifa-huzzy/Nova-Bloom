import connectDB from '../../db.js';
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
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, stripe-signature');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB();

    const slug = req.query.slug || [];
    const route = slug[0] || '';

    // POST /api/payments/create-intent
    if (req.method === 'POST' && route === 'create-intent') {
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
        amount: Math.round(order.totalPrice * 100),
        currency: 'usd',
        metadata: {
          orderId: order._id.toString(),
          userId: user._id.toString()
        }
      });

      return res.json({
        clientSecret: paymentIntent.client_secret
      });
    }

    // POST /api/payments/webhook
    if (req.method === 'POST' && route === 'webhook') {
      const sig = req.headers['stripe-signature'];
      let event;

      const body = Buffer.from(req.body || '', 'utf8');

      try {
        event = stripe.webhooks.constructEvent(
          body,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.orderId;

        try {
          const order = await Order.findById(orderId);
          if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
              id: paymentIntent.id,
              status: paymentIntent.status,
              update_time: new Date().toISOString(),
              email_address: paymentIntent.receipt_email
            };
            await order.save();
          }
        } catch (error) {
          console.error('Error updating order:', error);
        }
      }

      return res.json({ received: true });
    }

    return res.status(404).json({ message: 'Route not found' });
  } catch (error) {
    console.error('Payments error:', error);
    if (error.message.includes('Not authorized')) {
      return res.status(401).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
}

