const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    const adminEmail = 'tushar.mkt15@gmail.com';
    const adminPassword = 'admin123';
    const adminPhone = '01774405367';

    // Check if the admin user already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin user already exists.');
      mongoose.disconnect();
      return;
    }

    // Create a new admin user
    const admin = new User({
      fullName: 'Admin User',
      email: adminEmail,
      password: adminPassword, // Plain password, will be hashed by the User model
      phoneNumber: adminPhone,
      role: 'Admin',
      emailVerified: true,
      phoneVerified: true,
    });

    await admin.save();
    console.log('Admin user created successfully!');
    mongoose.disconnect();
  } catch (err) {
    console.error('Error creating admin user:', err.message);
    mongoose.disconnect();
  }
};

createAdmin();