const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function verifyUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mediconnect', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    const email = 'rakeshreddymagam@gmail.com';
    const user = await User.findOne({ email });

    if (!user) {
      console.log('❌ User not found in database');
      process.exit(1);
    }

    console.log('✅ User found in database:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Active: ${user.isActive}`);
    console.log(`   Password hash exists: ${user.password ? 'Yes' : 'No'}`);

    // Test password
    const testPassword = 'rakesh123';
    const isMatch = await user.comparePassword(testPassword);
    console.log(`\n🔐 Password test for "rakesh123": ${isMatch ? '✅ CORRECT' : '❌ INCORRECT'}`);

    if (!isMatch) {
      console.log('\n⚠️  Password mismatch! Let me reset it...');
      const bcrypt = require('bcryptjs');
      user.password = await bcrypt.hash('rakesh123', 10);
      await user.save();
      console.log('✅ Password reset to: rakesh123');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyUser();


