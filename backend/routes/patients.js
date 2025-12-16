const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const Order = require('../models/Order');

const router = express.Router();

// Get patient appointments
router.get('/appointments', auth, authorize('patient'), async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate('doctor', 'name specialization')
      .sort({ appointmentDate: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get patient prescriptions
router.get('/prescriptions', auth, authorize('patient'), async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user.id })
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get patient orders
router.get('/orders', auth, authorize('patient'), async (req, res) => {
  try {
    const orders = await Order.find({ patient: req.user.id })
      .populate('items.medicine')
      .populate('pharmacist', 'name pharmacyName')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get medical history
router.get('/medical-history', auth, authorize('patient'), async (req, res) => {
  try {
    const [appointments, prescriptions, orders] = await Promise.all([
      Appointment.find({ patient: req.user.id, status: 'completed' })
        .populate('doctor', 'name specialization'),
      Prescription.find({ patient: req.user.id })
        .populate('doctor', 'name specialization'),
      Order.find({ patient: req.user.id, status: 'delivered' })
        .populate('items.medicine')
    ]);

    res.json({ appointments, prescriptions, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;


