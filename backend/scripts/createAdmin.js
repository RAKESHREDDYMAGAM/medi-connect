const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mediconnect', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB\n');

    const email = process.argv[2] || 'admin@mediconnect.com';
    const password = process.argv[3] || 'admin123';
    const name = process.argv[4] || 'Admin User';

    // Check if admin exists
    let admin = await User.findOne({ email: email.toLowerCase().trim() });

    if (admin) {
      if (admin.role !== 'admin') {
        console.log('⚠️  User exists but is not an admin. Updating to admin...\n');
        admin.role = 'admin';
        admin.isActive = true;
        const hashedPassword = await bcrypt.hash(password, 10);
        admin.password = hashedPassword;
        await admin.save();
        console.log('✅ User updated to admin!\n');
      } else {
        console.log('⚠️  Admin already exists. Resetting password...\n');
        const hashedPassword = await bcrypt.hash(password, 10);
        admin.password = hashedPassword;
        admin.isActive = true;
        await admin.save();
        console.log('✅ Admin password reset!\n');
      }
    } else {
      console.log('Creating new admin account...\n');
      const hashedPassword = await bcrypt.hash(password, 10);
      admin = await User.create({
        name: name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        phone: '9876543500',
        role: 'admin',
        isActive: true
      });
      console.log('✅ Admin account created!\n');
    }

    // Verify password
    const testMatch = await admin.comparePassword(password);
    console.log('📋 Admin Account Details:');
    console.log(`   Name: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Active: ${admin.isActive}`);
    console.log(`   Password test: ${testMatch ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log('\n✅ Admin account is ready!');
    console.log('\n🔐 Login Credentials:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${password}`);
    console.log('\n📊 Admin can manage:');
    console.log('   - Doctors (approve/reject, activate/deactivate)');
    console.log('   - Patients (view, activate/deactivate)');
    console.log('   - Pharmacists (view, activate/deactivate)');
    console.log('   - All appointments');
    console.log('   - All orders');
    console.log('   - View analytics dashboard');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();


