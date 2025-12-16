const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

async function setDoctorPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mediconnect', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    const email = 'rakeshreddymagham@gmail.com';
    const password = 'rakesh123';

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }

    // Delete and recreate to ensure password is hashed correctly
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Use findOneAndUpdate to bypass pre-save hook
    await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { 
        password: hashedPassword,
        isApproved: true,
        isActive: true
      }
    );

    // Verify
    const updatedUser = await User.findOne({ email: email.toLowerCase().trim() });
    const testMatch = await updatedUser.comparePassword(password);
    
    console.log(`✅ Password set successfully!`);
    console.log(`   Email: ${updatedUser.email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Approved: ${updatedUser.isApproved}`);
    console.log(`   Password test: ${testMatch ? '✅ SUCCESS' : '❌ FAILED'}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setDoctorPassword();


