import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium wireless headphones with noise cancellation, 30-hour battery life, and superior sound quality. Perfect for music lovers and professionals.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    category: 'Electronics',
    stock: 50,
    rating: 4.5,
    numReviews: 120
  },
  {
    name: 'Smart Watch Pro',
    description: 'Feature-rich smartwatch with fitness tracking, heart rate monitor, GPS, and 7-day battery life. Compatible with iOS and Android.',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    category: 'Electronics',
    stock: 30,
    rating: 4.7,
    numReviews: 85
  },
  {
    name: 'Cotton T-Shirt',
    description: 'Comfortable 100% organic cotton t-shirt. Available in multiple colors. Perfect for casual wear. Machine washable.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    category: 'Clothing',
    stock: 100,
    rating: 4.3,
    numReviews: 200
  },
  {
    name: 'Leather Backpack',
    description: 'Genuine leather backpack with multiple compartments, laptop sleeve, and water-resistant design. Perfect for work or travel.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
    category: 'Accessories',
    stock: 40,
    rating: 4.6,
    numReviews: 95
  },
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with precision tracking, long battery life, and silent clicks. Compatible with Windows, Mac, and Linux.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop',
    category: 'Electronics',
    stock: 75,
    rating: 4.4,
    numReviews: 150
  },
  {
    name: 'Laptop Stand',
    description: 'Adjustable aluminum laptop stand for better ergonomics. Fits laptops up to 17 inches. Improves posture and reduces neck strain.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop',
    category: 'Accessories',
    stock: 60,
    rating: 4.5,
    numReviews: 180
  },
  {
    name: 'Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard with Cherry MX switches. Perfect for gaming and typing. Durable and responsive keys.',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=500&fit=crop',
    category: 'Electronics',
    stock: 45,
    rating: 4.6,
    numReviews: 220
  },
  {
    name: 'USB-C Hub',
    description: '7-in-1 USB-C hub with HDMI, USB 3.0 ports, SD card reader, and PD charging. Compatible with MacBook, iPad, and Windows laptops.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=500&h=500&fit=crop',
    category: 'Electronics',
    stock: 80,
    rating: 4.4,
    numReviews: 165
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes with cushioned sole and breathable mesh upper. Perfect for daily runs and workouts. Available in multiple sizes.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    category: 'Sports',
    stock: 90,
    rating: 4.7,
    numReviews: 310
  },
  {
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat with extra cushioning. Eco-friendly TPE material. Perfect for yoga, pilates, and fitness exercises.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop',
    category: 'Sports',
    stock: 120,
    rating: 4.5,
    numReviews: 195
  },
  {
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with 12-cup capacity. Auto-shutoff feature and brew strength control. Makes perfect coffee every time.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1565452344518-47faca79dc69?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Home & Kitchen',
    stock: 55,
    rating: 4.6,
    numReviews: 140
  },
  {
    name: 'Wireless Earbuds',
    description: 'True wireless earbuds with active noise cancellation. 8-hour battery life with charging case. Water-resistant design.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop',
    category: 'Electronics',
    stock: 65,
    rating: 4.5,
    numReviews: 275
  },
  {
    name: 'Denim Jacket',
    description: 'Classic denim jacket with a modern fit. 100% cotton denim. Timeless style that goes with everything. Machine washable.',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop',
    category: 'Clothing',
    stock: 70,
    rating: 4.4,
    numReviews: 125
  },
  {
    name: 'Sunglasses',
    description: 'Polarized sunglasses with UV400 protection. Lightweight frame design. Perfect for outdoor activities and driving.',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop',
    category: 'Accessories',
    stock: 85,
    rating: 4.6,
    numReviews: 210
  },
  {
    name: 'Wireless Speaker',
    description: 'Portable Bluetooth speaker with 360-degree sound. 20-hour battery life. Waterproof and dustproof. Perfect for outdoor adventures.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop',
    category: 'Electronics',
    stock: 50,
    rating: 4.7,
    numReviews: 190
  },
  {
    name: 'Desk Lamp',
    description: 'LED desk lamp with adjustable brightness and color temperature. USB charging port. Eye-care technology reduces eye strain.',
    price: 54.99,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop',
    category: 'Home & Kitchen',
    stock: 95,
    rating: 4.5,
    numReviews: 155
  },
  {
    name: 'Water Bottle',
    description: 'Stainless steel insulated water bottle. Keeps drinks cold for 24 hours or hot for 12 hours. BPA-free and leak-proof.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop',
    category: 'Accessories',
    stock: 150,
    rating: 4.8,
    numReviews: 420
  },
  {
    name: 'Hoodie',
    description: 'Comfortable hoodie with kangaroo pocket and drawstring hood. Soft cotton blend fabric. Perfect for casual wear.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop',
    category: 'Clothing',
    stock: 110,
    rating: 4.4,
    numReviews: 180
  },
  {
    name: 'Tablet Stand',
    description: 'Adjustable tablet stand with multiple viewing angles. Fits tablets up to 12.9 inches. Durable aluminum construction.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1675109313924-48bf0139b4a2?q=80&w=1098&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Accessories',
    stock: 70,
    rating: 4.3,
    numReviews: 95
  },
  {
    name: 'Webcams',
    description: 'HD 1080p webcam with auto-focus and built-in microphone. Perfect for video calls, streaming, and online meetings.',
    price: 64.99,
    image: 'https://images.unsplash.com/photo-1623949556303-b0d17d198863?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Electronics',
    stock: 40,
    rating: 4.5,
    numReviews: 130
  },
  {
    name: 'Reading Glasses',
    description: 'Blue light blocking reading glasses. Reduces eye strain from screens. Available in multiple strengths and frame styles.',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500&h=500&fit=crop',
    category: 'Accessories',
    stock: 200,
    rating: 4.2,
    numReviews: 85
  },
  {
    name: 'Fitness Tracker',
    description: 'Activity tracker with heart rate monitor, sleep tracking, and step counter. Water-resistant and 7-day battery life.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=500&h=500&fit=crop',
    category: 'Electronics',
    stock: 60,
    rating: 4.6,
    numReviews: 245
  },
  {
    name: 'Duffel Bag',
    description: 'Sports duffel bag with multiple compartments and side pockets. Durable water-resistant material. Perfect for gym and travel.',
    price: 54.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
    category: 'Accessories',
    stock: 75,
    rating: 4.5,
    numReviews: 110
  },
  {
    name: 'Jeans',
    description: 'Classic fit jeans with stretch comfort. Available in multiple washes and sizes. Versatile style for any occasion.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop',
    category: 'Clothing',
    stock: 130,
    rating: 4.4,
    numReviews: 295
  },
  {
    name: 'Phone Case',
    description: 'Protective phone case with shock-absorbing technology. Raised edges protect screen and camera. Available for multiple phone models.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=500&h=500&fit=crop',
    category: 'Accessories',
    stock: 180,
    rating: 4.3,
    numReviews: 340
  },
  {
    name: 'Portable Charger',
    description: '10000mAh portable power bank with fast charging. Dual USB ports. Compact design perfect for travel and daily use.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1706275399494-fb26bbc5da63?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Electronics',
    stock: 100,
    rating: 4.7,
    numReviews: 265
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing products (optional - remove this if you want to keep existing products)
    // await Product.deleteMany({});
    // console.log('Cleared existing products');

    // Check for existing products by name
    const existingProductNames = await Product.find({}).select('name');
    const existingNamesSet = new Set(existingProductNames.map(p => p.name.toLowerCase()));
    
    // Filter out products that already exist
    const newProducts = products.filter(product => !existingNamesSet.has(product.name.toLowerCase()));
    
    if (existingProductNames.length > 0) {
      console.log(`Found ${existingProductNames.length} existing products.`);
    }
    
    if (newProducts.length === 0) {
      console.log('All products already exist in the database!');
      const totalProducts = await Product.countDocuments();
      console.log(`Total products in database: ${totalProducts}`);
      process.exit(0);
    }

    // Insert only new products
    const createdProducts = await Product.insertMany(newProducts);
    console.log(`\nSuccessfully created ${createdProducts.length} new products!`);
    
    createdProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price} (${product.category})`);
    });

    const totalProducts = await Product.countDocuments();
    console.log(`\nTotal products in database: ${totalProducts}`);
    console.log('Products seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();

