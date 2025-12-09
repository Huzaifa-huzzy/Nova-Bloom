import connectDB from '../../db.js';
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB();
    const user = await protect(req);

    const slug = req.query.slug || [];
    const id = slug[0];
    const action = slug[1]; // 'pay' or 'deliver'

    // GET /api/orders/:id (get single order)
    if (req.method === 'GET' && id && !action) {
      const order = await Order.findById(id)
        .populate('user', 'name email')
        .populate('orderItems.product');

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      if (order.user._id.toString() !== user._id.toString() && user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
      }

      return res.json(order);
    }

    // PUT /api/orders/:id/pay (mark as paid)
    if (req.method === 'PUT' && id && action === 'pay') {
      const order = await Order.findById(id);

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      if (order.user.toString() !== user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address
      };

      const updatedOrder = await order.save();
      await updatedOrder.populate('user', 'name email');
      await updatedOrder.populate('orderItems.product');

      return res.json(updatedOrder);
    }

    // PUT /api/orders/:id/deliver (mark as delivered - admin only)
    if (req.method === 'PUT' && id && action === 'deliver') {
      if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized as admin' });
      }

      const order = await Order.findById(id);

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      await updatedOrder.populate('user', 'name email');
      await updatedOrder.populate('orderItems.product');

      return res.json(updatedOrder);
    }

    return res.status(404).json({ message: 'Route not found' });
  } catch (error) {
    console.error('Orders error:', error);
    if (error.message.includes('Not authorized')) {
      return res.status(401).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
}

