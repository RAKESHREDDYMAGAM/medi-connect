const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

const doctors = [
  {
    name: 'Dr. Abhi',
    email: 'abhi@doctor.com',
    password: 'doctor123',
    phone: '9876543210',
    role: 'doctor',
    specialization: 'Cardiologist',
    qualifications: ['MBBS', 'MD Cardiology'],
    experience: 10,
    consultationFee: 500,
    isApproved: true,
    isActive: true,
    availableSlots: [
      { day: 'Monday', startTime: '09:00', endTime: '17:00' },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
      { day: 'Friday', startTime: '09:00', endTime: '17:00' }
    ]
  },
  {
    name: 'Dr. Priya Sharma',
    email: 'priya@doctor.com',
    password: 'doctor123',
    phone: '9876543211',
    role: 'doctor',
    specialization: 'Dermatologist',
    qualifications: ['MBBS', 'MD Dermatology'],
    experience: 8,
    consultationFee: 400,
    isApproved: true,
    isActive: true,
    availableSlots: [
      { day: 'Tuesday', startTime: '10:00', endTime: '18:00' },
      { day: 'Thursday', startTime: '10:00', endTime: '18:00' },
      { day: 'Saturday', startTime: '10:00', endTime: '14:00' }
    ]
  },
  {
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh@doctor.com',
    password: 'doctor123',
    phone: '9876543212',
    role: 'doctor',
    specialization: 'Pediatrician',
    qualifications: ['MBBS', 'MD Pediatrics'],
    experience: 12,
    consultationFee: 450,
    isApproved: true,
    isActive: true,
    availableSlots: [
      { day: 'Monday', startTime: '09:00', endTime: '16:00' },
      { day: 'Tuesday', startTime: '09:00', endTime: '16:00' },
      { day: 'Wednesday', startTime: '09:00', endTime: '16:00' },
      { day: 'Thursday', startTime: '09:00', endTime: '16:00' },
      { day: 'Friday', startTime: '09:00', endTime: '16:00' }
    ]
  },
  {
    name: 'Dr. Anjali Patel',
    email: 'anjali@doctor.com',
    password: 'doctor123',
    phone: '9876543213',
    role: 'doctor',
    specialization: 'Orthopedic',
    qualifications: ['MBBS', 'MS Orthopedics'],
    experience: 15,
    consultationFee: 600,
    isApproved: true,
    isActive: true,
    availableSlots: [
      { day: 'Monday', startTime: '08:00', endTime: '17:00' },
      { day: 'Wednesday', startTime: '08:00', endTime: '17:00' },
      { day: 'Friday', startTime: '08:00', endTime: '17:00' }
    ]
  },
  {
    name: 'Dr. Vikram Singh',
    email: 'vikram@doctor.com',
    password: 'doctor123',
    phone: '9876543214',
    role: 'doctor',
    specialization: 'Neurologist',
    qualifications: ['MBBS', 'MD Neurology'],
    experience: 20,
    consultationFee: 800,
    isApproved: true,
    isActive: true,
    availableSlots: [
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
      { day: 'Thursday', startTime: '09:00', endTime: '17:00' },
      { day: 'Saturday', startTime: '09:00', endTime: '13:00' }
    ]
  }
];

async function seedDoctors() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mediconnect', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB');

    // Clear existing doctors (optional - comment out if you want to keep existing)
    // await User.deleteMany({ role: 'doctor' });
    // console.log('Cleared existing doctors');

    // Hash passwords and create doctors
    for (const doctor of doctors) {
      const existingDoctor = await User.findOne({ email: doctor.email });
      if (existingDoctor) {
        console.log(`Doctor ${doctor.name} already exists, skipping...`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(doctor.password, 10);
      const doctorData = {
        ...doctor,
        password: hashedPassword
      };

      await User.create(doctorData);
      console.log(`✅ Created doctor: ${doctor.name} - ${doctor.specialization}`);
    }

    console.log('\n🎉 All doctors seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding doctors:', error);
    process.exit(1);
  }
}

seedDoctors();


