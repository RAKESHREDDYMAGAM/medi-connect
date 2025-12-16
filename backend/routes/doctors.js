const express = require('express');
const mongoose = require('mongoose');
const { auth, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Get all doctors (for patient search) - Fetches directly from database
router.get('/', async (req, res) => {
  try {
    const { specialization, search } = req.query;
    const query = { role: 'doctor', isApproved: true, isActive: true };
    
    // If specialization filter is provided
    if (specialization && specialization.trim()) {
      query.specialization = new RegExp(specialization.trim(), 'i');
    }
    
    // If search term is provided, search in name or specialization
    if (search && search.trim()) {
      query.$or = [
        { name: new RegExp(search.trim(), 'i') },
        { specialization: new RegExp(search.trim(), 'i') },
        { qualifications: { $in: [new RegExp(search.trim(), 'i')] } }
      ];
    }

    // Fetch directly from MongoDB database
    console.log('🔍 Fetching doctors from database with query:', JSON.stringify(query));
    const doctors = await User.find(query)
      .select('name email specialization qualifications experience consultationFee availableSlots avatar')
      .sort({ name: 1 });
    
    console.log(`✅ Found ${doctors.length} doctors from database`);
    res.json(doctors);
  } catch (error) {
    console.error('❌ Error fetching doctors from database:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update doctor profile
router.put('/profile', auth, authorize('doctor'), async (req, res) => {
  try {
    const { specialization, qualifications, experience, consultationFee, availableSlots } = req.body;
    
    const doctor = await User.findByIdAndUpdate(
      req.user.id,
      {
        specialization,
        qualifications: qualifications ? qualifications.split(',') : [],
        experience,
        consultationFee,
        availableSlots: availableSlots || []
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get doctor appointments
router.get('/appointments/my-appointments', auth, authorize('doctor'), async (req, res) => {
  try {
    const { status } = req.query;
    const query = { doctor: req.user.id };
    
    if (status) {
      query.status = status;
    }
    
    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone')
      .populate('prescription')
      .sort({ appointmentDate: -1 });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update appointment (diagnosis, prescription)
router.put('/appointments/:id', auth, authorize('doctor'), async (req, res) => {
  try {
    const { diagnosis, notes, prescription } = req.body;
    
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, doctor: req.user.id },
      {
        diagnosis,
        notes,
        status: 'completed'
      },
      { new: true }
    ).populate('patient', 'name email');
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Create or update prescription if provided
    if (prescription && prescription.medicines) {
      // If appointment already has a prescription, update it; otherwise create new one
      if (appointment.prescription) {
        await Prescription.findByIdAndUpdate(
          appointment.prescription,
          {
            medicines: prescription.medicines,
            diagnosis: prescription.diagnosis || diagnosis,
            notes: prescription.notes || notes
          },
          { new: true }
        );
      } else {
        const newPrescription = await Prescription.create({
          patient: appointment.patient._id,
          doctor: req.user.id,
          appointment: appointment._id,
          medicines: prescription.medicines,
          diagnosis: prescription.diagnosis || diagnosis,
          notes: prescription.notes || notes
        });
        
        appointment.prescription = newPrescription._id;
        await appointment.save();
      }
    }
    
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get doctor prescriptions - MUST be before /:id route
router.get('/prescriptions', auth, authorize('doctor'), async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ doctor: req.user.id })
      .populate('patient', 'name email')
      .populate('appointment')
      .sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get doctor analytics - MUST be before /:id route
router.get('/analytics/dashboard', auth, authorize('doctor'), async (req, res) => {
  try {
    const doctorId = req.user.id;
    
    const [totalAppointments, completedAppointments, pendingAppointments, totalPatients, totalPrescriptions] = await Promise.all([
      Appointment.countDocuments({ doctor: doctorId }),
      Appointment.countDocuments({ doctor: doctorId, status: 'completed' }),
      Appointment.countDocuments({ doctor: doctorId, status: 'pending' }),
      Appointment.distinct('patient', { doctor: doctorId }),
      Prescription.countDocuments({ doctor: doctorId })
    ]);
    
    const recentAppointments = await Appointment.find({ doctor: doctorId })
      .populate('patient', 'name')
      .sort({ appointmentDate: -1 })
      .limit(5);
    
    res.json({
      totalAppointments,
      completedAppointments,
      pendingAppointments,
      totalPatients: totalPatients.length,
      totalPrescriptions,
      recentAppointments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get doctor profile - MUST be last (after all specific routes)
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    // Check if it's a reserved route name (shouldn't happen if routes are ordered correctly, but safety check)
    const reservedRoutes = ['prescriptions', 'analytics', 'appointments', 'profile'];
    if (reservedRoutes.includes(id)) {
      return res.status(404).json({ message: 'Route not found' });
    }
    
    // Validate that the id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid doctor ID format' });
    }
    
    const doctor = await User.findById(id)
      .select('-password');
    
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

