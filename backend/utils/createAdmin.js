import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    
    const { name, email, password } = {
      name: process.argv[2] || 'Admin User',
      email: process.argv[3] || 'admin@example.com',
      password: process.argv[4] || 'admin123'
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      if (existingAdmin.role === 'admin') {
        console.log('Admin user already exists!');
        process.exit(0);
      } else {
        // Update existing user to admin
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('User updated to admin successfully!');
        console.log(`Email: ${email}`);
        process.exit(0);
      }
    }

    // Create new admin user
    const admin = await User.create({
      name,
      email,
      password,
      role: 'admin'
    });

    console.log('Admin user created successfully!');
    console.log(`Name: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${password}`);
    console.log('\nPlease change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();

