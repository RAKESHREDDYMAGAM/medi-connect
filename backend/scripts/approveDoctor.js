const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function approveDoctor() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mediconnect', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB\n');

    const email = process.argv[2] || 'rakeshreddymagham@gmail.com';

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      console.log(`❌ User with email ${email} not found.`);
      console.log('Creating new approved doctor account...\n');
      
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('rakesh123', 10);
      
      const newDoctor = await User.create({
        name: 'Dr. Rakesh Reddy',
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        phone: '9876543200',
        role: 'doctor',
        specialization: 'General Physician',
        qualifications: ['MBBS', 'MD'],
        experience: 5,
        consultationFee: 400,
        isApproved: true,
        isActive: true,
        availableSlots: [
          { day: 'Monday', startTime: '09:00', endTime: '17:00' },
          { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
          { day: 'Friday', startTime: '09:00', endTime: '17:00' }
        ]
      });
      
      console.log('✅ Doctor account created and approved!\n');
      console.log('📋 Login Credentials:');
      console.log(`   Email: ${newDoctor.email}`);
      console.log(`   Password: rakesh123`);
      console.log(`   Role: ${newDoctor.role}`);
      console.log(`   Approved: ${newDoctor.isApproved}`);
    } else {
      if (user.role !== 'doctor') {
        console.log(`⚠️  User exists but is not a doctor. Current role: ${user.role}`);
        console.log('Updating to doctor role and approving...\n');
        
        user.role = 'doctor';
        user.specialization = user.specialization || 'General Physician';
        user.qualifications = user.qualifications || ['MBBS'];
        user.experience = user.experience || 5;
        user.consultationFee = user.consultationFee || 400;
        user.isApproved = true;
        user.isActive = true;
        await user.save();
        
        console.log('✅ User updated to approved doctor!\n');
      } else {
        console.log('Found doctor account. Approving...\n');
        user.isApproved = true;
        user.isActive = true;
        await user.save();
        console.log('✅ Doctor account approved!\n');
      }
      
      console.log('📋 Login Credentials:');
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: (your current password)`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Approved: ${user.isApproved}`);
      console.log(`\n✅ You can now login as a doctor!`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

approveDoctor();


