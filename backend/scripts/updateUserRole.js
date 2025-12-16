const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function updateUserRole() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mediconnect', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB\n');

    const email = 'rakeshreddymagam@gmail.com';
    const newRole = 'pharmacist';
    const pharmacyName = 'oifxgcnb';
    const licenseNumber = '13-02-275760';

    // Find existing user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      console.log('❌ User not found with email:', email);
      process.exit(1);
    }

    console.log(`📋 Current User Info:`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Current Role: ${user.role}`);
    console.log(`   Phone: ${user.phone}\n`);

    // Update user role and pharmacist-specific fields
    user.role = newRole;
    user.pharmacyName = pharmacyName;
    user.licenseNumber = licenseNumber;
    user.isActive = true;
    
    await user.save();

    console.log('✅ User updated successfully!\n');
    console.log(`📋 Updated User Info:`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   New Role: ${user.role}`);
    console.log(`   Pharmacy Name: ${user.pharmacyName}`);
    console.log(`   License Number: ${user.licenseNumber}`);
    console.log(`\n✅ You can now login as ${newRole}!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateUserRole();
