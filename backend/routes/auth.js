const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const EmailVerification = require('../models/EmailVerification');
const OTPVerification = require('../models/OTPVerification');
const { auth } = require('../middleware/auth');
const { sendVerificationEmail, sendOTPEmail } = require('../utils/emailService');

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_secret_key', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty(),
  body('phone').trim().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, role, specialization, address, dateOfBirth, gender, pharmacyName, licenseNumber } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create account directly for all roles (no OTP verification required)
    const userData = {
      name,
      email,
      password,
      phone,
      role: role || 'patient',
      address,
      dateOfBirth,
      gender
    };

    if (role === 'doctor') {
      userData.specialization = specialization;
      userData.isApproved = false; // Doctors still need admin approval
    }

    if (role === 'pharmacist') {
      userData.pharmacyName = pharmacyName;
      userData.licenseNumber = licenseNumber;
    }

    const user = await User.create(userData);
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty(),
  body('role').optional().isIn(['patient', 'doctor', 'pharmacist', 'admin'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role } = req.body;

    // Normalize email for lookup (User model stores emails in lowercase)
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      console.log('❌ Login failed: User not found for email:', normalizedEmail);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('❌ Login failed: Password mismatch for email:', normalizedEmail);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    if (user.role === 'doctor' && !user.isApproved) {
      return res.status(401).json({ message: 'Doctor account pending approval' });
    }

    // Track login for the specific role
    const now = new Date();
    let lastLoginValue = null;
    
    // Update the appropriate login field based on role
    if (user.role === 'patient') {
      user.lastLoginAsPatient = now;
      lastLoginValue = now;
    } else if (user.role === 'doctor') {
      user.lastLoginAsDoctor = now;
      lastLoginValue = now;
    } else if (user.role === 'pharmacist') {
      user.lastLoginAsPharmacist = now;
      lastLoginValue = now;
    } else if (user.role === 'admin') {
      user.lastLoginAsAdmin = now;
      lastLoginValue = now;
    }

    // Add to login history - handle case where loginHistory might not exist
    try {
      const clientIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
      const userAgent = req.headers['user-agent'] || 'Unknown';
      
      if (!user.loginHistory) {
        user.loginHistory = [];
      }
      
      user.loginHistory.push({
        role: user.role,
        loginTime: now,
        ipAddress: clientIp,
        userAgent: userAgent
      });

      // Keep only last 50 login records
      if (user.loginHistory.length > 50) {
        user.loginHistory = user.loginHistory.slice(-50);
      }
    } catch (historyError) {
      console.error('Warning: Could not update login history:', historyError.message);
      // Continue with login even if history update fails
    }

    // Save user - wrap in try-catch to handle any save errors
    try {
      await user.save();
    } catch (saveError) {
      console.error('Error saving user login info:', saveError.message);
      // Continue with login even if save fails
    }

    const token = generateToken(user._id);

    console.log('✅ Login successful for:', normalizedEmail, 'Role:', user.role);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        lastLogin: lastLoginValue
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
});

// Verify OTP
router.post('/verify-otp', [
  body('email').isEmail().normalizeEmail(),
  body('otp').isLength({ min: 6, max: 6 }).isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp } = req.body;

    const verification = await OTPVerification.findOne({
      email: email.toLowerCase().trim(),
      verified: false
    });

    if (!verification) {
      return res.status(400).json({ message: 'No pending verification found. Please register again.' });
    }

    if (verification.expiresAt < new Date()) {
      await OTPVerification.deleteOne({ _id: verification._id });
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    if (verification.attempts >= 5) {
      await OTPVerification.deleteOne({ _id: verification._id });
      return res.status(400).json({ message: 'Too many failed attempts. Please register again.' });
    }

    if (verification.otp !== otp) {
      verification.attempts += 1;
      await verification.save();
      return res.status(400).json({ 
        message: `Invalid OTP. ${5 - verification.attempts} attempts remaining.` 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: verification.email });
    if (existingUser) {
      await OTPVerification.deleteOne({ _id: verification._id });
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user account
    const user = await User.create(verification.userData);

    // Mark verification as complete
    verification.verified = true;
    await verification.save();

    // Generate token for immediate login
    const authToken = generateToken(user._id);

    res.json({
      message: 'OTP verified successfully! Your account has been created.',
      token: authToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Resend OTP
router.post('/resend-otp', [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    const verification = await OTPVerification.findOne({
      email: email.toLowerCase().trim(),
      verified: false
    });

    if (!verification) {
      return res.status(400).json({ message: 'No pending verification found for this email' });
    }

    // Generate new OTP
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
    verification.otp = newOTP;
    verification.expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    verification.attempts = 0;
    await verification.save();

    await sendOTPEmail(email, newOTP, verification.role);

    res.json({ message: 'OTP resent successfully! Please check your email.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Resend verification email
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    const verification = await EmailVerification.findOne({
      email: email.toLowerCase().trim(),
      verified: false
    });

    if (!verification) {
      return res.status(400).json({ message: 'No pending verification found for this email' });
    }

    // Generate new token
    const newToken = crypto.randomBytes(32).toString('hex');
    verification.token = newToken;
    verification.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await verification.save();

    await sendVerificationEmail(email, newToken, verification.role);

    res.json({ message: 'Verification email resent successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get login history for current user
router.get('/login-history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('lastLoginAsPatient lastLoginAsDoctor lastLoginAsPharmacist lastLoginAsAdmin loginHistory role');
    
    const loginInfo = {
      currentRole: user.role,
      lastLoginAsPatient: user.lastLoginAsPatient,
      lastLoginAsDoctor: user.lastLoginAsDoctor,
      lastLoginAsPharmacist: user.lastLoginAsPharmacist,
      lastLoginAsAdmin: user.lastLoginAsAdmin,
      loginHistory: user.loginHistory || []
    };
    
    res.json(loginInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

