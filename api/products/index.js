import connectDB from '../db.js';
import Product from '../../backend/models/Product.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB();

    if (req.method === 'GET') {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const category = req.query.category;
      const search = req.query.search;

      let query = {};
      if (category) {
        query.category = category;
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      const products = await Product.find(query)
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 });

      const total = await Product.countDocuments(query);

      return res.json({
        products,
        page,
        pages: Math.ceil(total / limit),
        total
      });
    }

    if (req.method === 'POST') {
      // Admin only - check auth
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      const jwt = await import('jsonwebtoken');
      const User = (await import('../../backend/models/User.js')).default;
      
      try {
        const decoded = jwt.default.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (!user || user.role !== 'admin') {
          return res.status(403).json({ message: 'Not authorized as admin' });
        }

        const product = await Product.create(req.body);
        return res.status(201).json(product);
      } catch (error) {
        return res.status(401).json({ message: 'Not authorized' });
      }
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Products error:', error);
    res.status(500).json({ message: error.message });
  }
}

