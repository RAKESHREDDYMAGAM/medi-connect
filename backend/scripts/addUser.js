const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

async function addUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mediconnect', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB\n');

    const email = process.argv[2] || 'rakeshreddymagam@gmail.com';
    const password = process.argv[3] || 'rakesh123';
    const role = process.argv[4] || 'patient';

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`⚠️  User with email ${email} already exists!`);
      console.log(`   Role: ${existingUser.role}`);
      console.log(`   You can login with this email and your password.`);
      process.exit(0);
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      email: email,
      password: hashedPassword,
      phone: '9876543200',
      role: role,
      isActive: true
    };

    if (role === 'doctor') {
      userData.specialization = 'General Physician';
      userData.qualifications = ['MBBS'];
      userData.experience = 5;
      userData.consultationFee = 300;
      userData.isApproved = false; // Needs admin approval
    }

    const user = await User.create(userData);
    console.log(`✅ User created successfully!\n`);
    console.log(`📋 Login Credentials:`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: ${role}`);
    if (role === 'doctor') {
      console.log(`   ⚠️  Note: Doctor account needs admin approval to login`);
    }
    console.log(`\n✅ You can now login with these credentials!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addUser();


