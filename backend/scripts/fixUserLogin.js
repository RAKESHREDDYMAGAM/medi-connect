const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

async function fixUserLogin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mediconnect', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB\n');

    const email = 'rakeshreddymagam@gmail.com';
    const password = 'rakesh123';

    // Find existing user
    let user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (user) {
      console.log('Found existing user, updating password...');
      // Update password
      user.password = await bcrypt.hash(password, 10);
      user.isActive = true;
      await user.save();
      console.log('✅ Password updated');
    } else {
      console.log('User not found, creating new user...');
      // Create new user
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({
        name: 'Rakesh Reddy',
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        phone: '9876543200',
        role: 'patient',
        isActive: true
      });
      console.log('✅ User created');
    }

    // Verify password works
    const testMatch = await user.comparePassword(password);
    console.log(`\n🔐 Password verification: ${testMatch ? '✅ SUCCESS' : '❌ FAILED'}`);
    
    if (!testMatch) {
      console.log('⚠️  Password still not matching, trying direct hash...');
      const newHash = await bcrypt.hash(password, 10);
      user.password = newHash;
      await user.save();
      const testMatch2 = await user.comparePassword(password);
      console.log(`🔐 Retry verification: ${testMatch2 ? '✅ SUCCESS' : '❌ FAILED'}`);
    }

    console.log('\n📋 Final Account Details:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Active: ${user.isActive}`);
    console.log(`\n✅ You can now login with:`);
    console.log(`   Email: rakeshreddymagam@gmail.com`);
    console.log(`   Password: rakesh123`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixUserLogin();


