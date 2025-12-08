import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const removeDuplicates = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Find duplicates by name
    const duplicates = await Product.aggregate([
      {
        $group: {
          _id: { $toLower: '$name' },
          count: { $sum: 1 },
          ids: { $push: '$_id' }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]);

    if (duplicates.length === 0) {
      console.log('No duplicates found!');
      mongoose.connection.close();
      process.exit(0);
    }

    console.log(`Found ${duplicates.length} duplicate product(s). Removing duplicates...\n`);

    let removedCount = 0;
    for (const dup of duplicates) {
      // Keep the first ID, remove the rest
      const idsToRemove = dup.ids.slice(1);
      const result = await Product.deleteMany({ _id: { $in: idsToRemove } });
      removedCount += result.deletedCount;
      console.log(`Removed ${result.deletedCount} duplicate(s) of "${dup.ids[0]}"`);
    }

    const totalCount = await Product.countDocuments();
    console.log(`\nRemoved ${removedCount} duplicate products.`);
    console.log(`Total products remaining: ${totalCount}`);

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error removing duplicates:', error);
    process.exit(1);
  }
};

removeDuplicates();

