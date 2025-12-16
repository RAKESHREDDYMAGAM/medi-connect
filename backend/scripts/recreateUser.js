const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function recreateUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mediconnect', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB\n');

    const email = 'rakeshreddymagam@gmail.com';
    const password = 'rakesh123';

    // Delete existing user
    await User.deleteOne({ email: email.toLowerCase().trim() });
    console.log('✅ Deleted existing user\n');

    // Create new user (password will be hashed by pre-save hook)
    const user = await User.create({
      name: 'Rakesh Reddy',
      email: email.toLowerCase().trim(),
      password: password, // Will be hashed by pre-save hook
      phone: '9876543200',
      role: 'patient',
      isActive: true
    });

    console.log('✅ User created successfully\n');

    // Verify password works
    const testMatch = await user.comparePassword(password);
    console.log(`🔐 Password test: ${testMatch ? '✅ SUCCESS' : '❌ FAILED'}`);
    
    if (testMatch) {
      console.log('\n📋 Login Credentials:');
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: ${password}`);
      console.log(`   Role: ${user.role}`);
      console.log(`\n✅ You can now login successfully!`);
    } else {
      console.log('\n❌ Password verification failed. Please try again.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

recreateUser();


