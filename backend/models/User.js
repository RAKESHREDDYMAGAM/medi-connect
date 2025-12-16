const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'pharmacist', 'admin'],
    default: 'patient'
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  // Doctor specific fields
  specialization: {
    type: String
  },
  qualifications: {
    type: [String]
  },
  experience: {
    type: Number
  },
  consultationFee: {
    type: Number,
    default: 0
  },
  availableSlots: [{
    day: String,
    startTime: String,
    endTime: String
  }],
  isApproved: {
    type: Boolean,
    default: false
  },
  // Patient specific fields
  bloodGroup: {
    type: String
  },
  insuranceDetails: {
    provider: String,
    policyNumber: String
  },
  // Pharmacist specific fields
  pharmacyName: {
    type: String
  },
  licenseNumber: {
    type: String
  },
  avatar: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Role-based login tracking
  lastLoginAsPatient: {
    type: Date
  },
  lastLoginAsDoctor: {
    type: Date
  },
  lastLoginAsPharmacist: {
    type: Date
  },
  lastLoginAsAdmin: {
    type: Date
  },
  // Login history for all roles
  loginHistory: [{
    role: {
      type: String,
      enum: ['patient', 'doctor', 'pharmacist', 'admin']
    },
    loginTime: {
      type: Date,
      default: Date.now
    },
    ipAddress: String,
    userAgent: String
  }]
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

