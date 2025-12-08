import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const checkDuplicates = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    const totalCount = await Product.countDocuments();
    console.log(`Total products in database: ${totalCount}`);

    // Find duplicates by name
    const duplicates = await Product.aggregate([
      {
        $group: {
          _id: { $toLower: '$name' },
          count: { $sum: 1 },
          ids: { $push: '$_id' },
          names: { $push: '$name' }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]);

    if (duplicates.length > 0) {
      console.log(`\nFound ${duplicates.length} duplicate product(s):`);
      duplicates.forEach((dup, index) => {
        console.log(`${index + 1}. "${dup.names[0]}" appears ${dup.count} times`);
        console.log(`   IDs: ${dup.ids.join(', ')}`);
      });
      
      console.log('\nTo remove duplicates, you can delete the extra copies manually or use MongoDB shell.');
    } else {
      console.log('\nNo duplicates found! All products are unique.');
    }

    // List all products
    const allProducts = await Product.find({}).select('name category price').sort({ name: 1 });
    console.log(`\nAll ${allProducts.length} products:`);
    allProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price} (${product.category})`);
    });

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error checking duplicates:', error);
    process.exit(1);
  }
};

checkDuplicates();

