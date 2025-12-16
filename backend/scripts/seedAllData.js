const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const Medicine = require('../models/Medicine');
const Order = require('../models/Order');

// Seed Users
const users = [
  // Patients
  {
    name: 'John Doe',
    email: 'patient@test.com',
    password: 'patient123',
    phone: '9876543210',
    role: 'patient',
    address: '123 Main Street, City',
    dateOfBirth: new Date('1990-01-15'),
    gender: 'male',
    bloodGroup: 'O+',
    isActive: true
  },
  {
    name: 'Jane Smith',
    email: 'jane@test.com',
    password: 'patient123',
    phone: '9876543211',
    role: 'patient',
    address: '456 Park Avenue, City',
    dateOfBirth: new Date('1985-05-20'),
    gender: 'female',
    bloodGroup: 'A+',
    isActive: true
  },
  {
    name: 'Mike Johnson',
    email: 'mike@test.com',
    password: 'patient123',
    phone: '9876543212',
    role: 'patient',
    address: '789 Oak Street, City',
    dateOfBirth: new Date('1992-08-10'),
    gender: 'male',
    bloodGroup: 'B+',
    isActive: true
  },
  // Doctors
  {
    name: 'Dr. Abhi',
    email: 'abhi@doctor.com',
    password: 'doctor123',
    phone: '9876543300',
    role: 'doctor',
    specialization: 'Cardiologist',
    qualifications: ['MBBS', 'MD Cardiology', 'Fellowship in Interventional Cardiology'],
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
    phone: '9876543301',
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
    phone: '9876543302',
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
    phone: '9876543303',
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
  // Pharmacists
  {
    name: 'Pharma Manager',
    email: 'pharmacist@test.com',
    password: 'pharma123',
    phone: '9876543400',
    role: 'pharmacist',
    pharmacyName: 'MediCare Pharmacy',
    licenseNumber: 'PH123456',
    address: '100 Medical Street, City',
    isActive: true
  },
  {
    name: 'Pharma Assistant',
    email: 'pharma2@test.com',
    password: 'pharma123',
    phone: '9876543401',
    role: 'pharmacist',
    pharmacyName: 'HealthPlus Pharmacy',
    licenseNumber: 'PH123457',
    address: '200 Health Avenue, City',
    isActive: true
  },
  // Admin
  {
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'admin123',
    phone: '9876543500',
    role: 'admin',
    isActive: true
  }
];

// Medicines
const medicines = [
  {
    name: 'Paracetamol 500mg',
    genericName: 'Acetaminophen',
    manufacturer: 'ABC Pharmaceuticals',
    category: 'Pain Relief',
    description: 'Used for fever and pain relief',
    price: 25,
    stock: 500,
    expiryDate: new Date('2026-12-31'),
    requiresPrescription: false,
    isActive: true
  },
  {
    name: 'Amoxicillin 250mg',
    genericName: 'Amoxicillin',
    manufacturer: 'XYZ Pharma',
    category: 'Antibiotic',
    description: 'Antibiotic for bacterial infections',
    price: 150,
    stock: 300,
    expiryDate: new Date('2026-06-30'),
    requiresPrescription: true,
    isActive: true
  },
  {
    name: 'Aspirin 75mg',
    genericName: 'Acetylsalicylic Acid',
    manufacturer: 'MediCorp',
    category: 'Cardiac',
    description: 'Blood thinner for heart conditions',
    price: 45,
    stock: 400,
    expiryDate: new Date('2027-03-31'),
    requiresPrescription: true,
    isActive: true
  },
  {
    name: 'Atorvastatin 20mg',
    genericName: 'Atorvastatin',
    manufacturer: 'HealthPharma',
    category: 'Cardiac',
    description: 'Cholesterol lowering medication',
    price: 200,
    stock: 250,
    expiryDate: new Date('2026-09-30'),
    requiresPrescription: true,
    isActive: true
  },
  {
    name: 'Cetirizine 10mg',
    genericName: 'Cetirizine',
    manufacturer: 'AllerMed',
    category: 'Antihistamine',
    description: 'For allergies and hay fever',
    price: 35,
    stock: 600,
    expiryDate: new Date('2027-01-31'),
    requiresPrescription: false,
    isActive: true
  },
  {
    name: 'Omeprazole 20mg',
    genericName: 'Omeprazole',
    manufacturer: 'DigestPharm',
    category: 'Gastrointestinal',
    description: 'For acid reflux and stomach ulcers',
    price: 120,
    stock: 350,
    expiryDate: new Date('2026-11-30'),
    requiresPrescription: true,
    isActive: true
  },
  {
    name: 'Metformin 500mg',
    genericName: 'Metformin',
    manufacturer: 'DiabCare',
    category: 'Diabetes',
    description: 'For type 2 diabetes management',
    price: 80,
    stock: 450,
    expiryDate: new Date('2027-02-28'),
    requiresPrescription: true,
    isActive: true
  },
  {
    name: 'Ibuprofen 400mg',
    genericName: 'Ibuprofen',
    manufacturer: 'PainRelief Inc',
    category: 'Pain Relief',
    description: 'Anti-inflammatory pain reliever',
    price: 55,
    stock: 500,
    expiryDate: new Date('2026-10-31'),
    requiresPrescription: false,
    isActive: true
  }
];

async function seedAllData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mediconnect', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data (optional)
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Appointment.deleteMany({});
    await Prescription.deleteMany({});
    await Medicine.deleteMany({});
    await Order.deleteMany({});
    console.log('✅ Cleared existing data\n');

    // Seed Users
    console.log('Creating users...');
    const createdUsers = {};
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const userData = {
        ...user,
        password: hashedPassword
      };
      const created = await User.create(userData);
      createdUsers[user.email] = created;
      console.log(`  ✅ Created ${user.role}: ${user.name} (${user.email})`);
    }
    console.log('✅ All users created\n');

    // Seed Medicines
    console.log('Creating medicines...');
    const createdMedicines = {};
    for (const medicine of medicines) {
      const created = await Medicine.create(medicine);
      createdMedicines[medicine.name] = created;
      console.log(`  ✅ Created medicine: ${medicine.name}`);
    }
    console.log('✅ All medicines created\n');

    // Seed Appointments
    console.log('Creating appointments...');
    const patient1 = createdUsers['patient@test.com'];
    const patient2 = createdUsers['jane@test.com'];
    const doctor1 = createdUsers['abhi@doctor.com'];
    const doctor2 = createdUsers['priya@doctor.com'];

    const appointments = [
      {
        patient: patient1._id,
        doctor: doctor1._id,
        appointmentDate: new Date('2025-12-15'),
        appointmentTime: '10:00',
        status: 'completed',
        consultationType: 'in-person',
        symptoms: 'Chest pain and shortness of breath',
        diagnosis: 'Mild hypertension, advised lifestyle changes',
        notes: 'Patient needs regular monitoring',
        paymentStatus: 'paid',
        amount: 500
      },
      {
        patient: patient1._id,
        doctor: doctor1._id,
        appointmentDate: new Date('2025-12-20'),
        appointmentTime: '14:00',
        status: 'confirmed',
        consultationType: 'online',
        symptoms: 'Follow-up for hypertension',
        paymentStatus: 'paid',
        amount: 500
      },
      {
        patient: patient2._id,
        doctor: doctor2._id,
        appointmentDate: new Date('2025-12-14'),
        appointmentTime: '11:00',
        status: 'completed',
        consultationType: 'in-person',
        symptoms: 'Skin rash and itching',
        diagnosis: 'Allergic dermatitis',
        notes: 'Prescribed antihistamine and topical cream',
        paymentStatus: 'paid',
        amount: 400
      },
      {
        patient: patient2._id,
        doctor: doctor2._id,
        appointmentDate: new Date('2025-12-18'),
        appointmentTime: '15:00',
        status: 'pending',
        consultationType: 'in-person',
        symptoms: 'Follow-up for skin condition',
        paymentStatus: 'pending',
        amount: 400
      }
    ];

    const createdAppointments = [];
    for (const appointment of appointments) {
      const created = await Appointment.create(appointment);
      createdAppointments.push(created);
      console.log(`  ✅ Created appointment: ${appointment.status} - ${appointment.appointmentDate.toDateString()}`);
    }
    console.log('✅ All appointments created\n');

    // Seed Prescriptions
    console.log('Creating prescriptions...');
    const completedAppointments = createdAppointments.filter(a => a.status === 'completed');
    
    const prescriptions = [
      {
        patient: patient1._id,
        doctor: doctor1._id,
        appointment: completedAppointments[0]._id,
        medicines: [
          {
            medicineName: 'Aspirin 75mg',
            dosage: '75mg',
            frequency: 'Once daily',
            duration: '30 days',
            instructions: 'Take with food, in the morning'
          },
          {
            medicineName: 'Atorvastatin 20mg',
            dosage: '20mg',
            frequency: 'Once daily',
            duration: '30 days',
            instructions: 'Take at bedtime'
          }
        ],
        diagnosis: 'Mild hypertension',
        notes: 'Monitor blood pressure weekly. Follow up in 1 month.',
        isValid: true
      },
      {
        patient: patient2._id,
        doctor: doctor2._id,
        appointment: completedAppointments[1]._id,
        medicines: [
          {
            medicineName: 'Cetirizine 10mg',
            dosage: '10mg',
            frequency: 'Once daily',
            duration: '7 days',
            instructions: 'Take at night before sleep'
          }
        ],
        diagnosis: 'Allergic dermatitis',
        notes: 'Avoid allergens. Use mild soap. Follow up if symptoms persist.',
        isValid: true
      }
    ];

    const createdPrescriptions = [];
    for (const prescription of prescriptions) {
      const created = await Prescription.create(prescription);
      createdPrescriptions.push(created);
      
      // Link prescription to appointment
      await Appointment.findByIdAndUpdate(created.appointment, { prescription: created._id });
      
      console.log(`  ✅ Created prescription for ${prescription.diagnosis}`);
    }
    console.log('✅ All prescriptions created\n');

    // Seed Orders
    console.log('Creating orders...');
    const pharmacist = createdUsers['pharmacist@test.com'];
    
    const orders = [
      {
        patient: patient1._id,
        pharmacist: pharmacist._id,
        prescription: createdPrescriptions[0]._id,
        items: [
          {
            medicine: createdMedicines['Aspirin 75mg']._id,
            quantity: 2,
            price: 45
          },
          {
            medicine: createdMedicines['Atorvastatin 20mg']._id,
            quantity: 1,
            price: 200
          }
        ],
        totalAmount: 290,
        status: 'delivered',
        paymentStatus: 'paid',
        paymentMethod: 'Online',
        shippingAddress: {
          street: '123 Main Street',
          city: 'City',
          state: 'State',
          zipCode: '12345',
          phone: '9876543210'
        },
        trackingNumber: 'TRACK123456'
      },
      {
        patient: patient2._id,
        pharmacist: pharmacist._id,
        prescription: createdPrescriptions[1]._id,
        items: [
          {
            medicine: createdMedicines['Cetirizine 10mg']._id,
            quantity: 1,
            price: 35
          }
        ],
        totalAmount: 35,
        status: 'dispatched',
        paymentStatus: 'paid',
        paymentMethod: 'Online',
        shippingAddress: {
          street: '456 Park Avenue',
          city: 'City',
          state: 'State',
          zipCode: '12346',
          phone: '9876543211'
        },
        trackingNumber: 'TRACK123457'
      },
      {
        patient: patient1._id,
        items: [
          {
            medicine: createdMedicines['Paracetamol 500mg']._id,
            quantity: 1,
            price: 25
          },
          {
            medicine: createdMedicines['Ibuprofen 400mg']._id,
            quantity: 1,
            price: 55
          }
        ],
        totalAmount: 80,
        status: 'pending',
        paymentStatus: 'pending',
        shippingAddress: {
          street: '123 Main Street',
          city: 'City',
          state: 'State',
          zipCode: '12345',
          phone: '9876543210'
        }
      }
    ];

    for (const order of orders) {
      const created = await Order.create(order);
      console.log(`  ✅ Created order: ${created.status} - ₹${created.totalAmount}`);
    }
    console.log('✅ All orders created\n');

    console.log('🎉 All demo data seeded successfully!\n');
    console.log('📋 Login Credentials:');
    console.log('  Patient: patient@test.com / patient123');
    console.log('  Patient: jane@test.com / patient123');
    console.log('  Doctor: abhi@doctor.com / doctor123');
    console.log('  Doctor: priya@doctor.com / doctor123');
    console.log('  Pharmacist: pharmacist@test.com / pharma123');
    console.log('  Admin: admin@test.com / admin123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedAllData();


