const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Order = require('../models/Order');
const Medicine = require('../models/Medicine');

const router = express.Router();

// All routes require admin role
router.use(auth, authorize('admin'));

// Get all users - Fetches directly from database
router.get('/users', async (req, res) => {
  try {
    const { role } = req.query;
    const query = {};
    
    if (role) {
      query.role = role;
    }
    
    console.log('🔍 Fetching users from database with query:', JSON.stringify(query));
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${users.length} users from database`);
    res.json(users);
  } catch (error) {
    console.error('❌ Error fetching users from database:', error);
    res.status(500).json({ message: error.message });
  }
});

// Search pharmacists - Fetches directly from database
router.get('/pharmacists', async (req, res) => {
  try {
    const { search } = req.query;
    const query = { role: 'pharmacist', isActive: true };
    
    if (search && search.trim()) {
      query.$or = [
        { name: new RegExp(search.trim(), 'i') },
        { email: new RegExp(search.trim(), 'i') },
        { pharmacyName: new RegExp(search.trim(), 'i') }
      ];
    }
    
    console.log('🔍 Fetching pharmacists from database with query:', JSON.stringify(query));
    const pharmacists = await User.find(query)
      .select('name email phone pharmacyName licenseNumber address isActive')
      .sort({ name: 1 });
    
    console.log(`✅ Found ${pharmacists.length} pharmacists from database`);
    res.json(pharmacists);
  } catch (error) {
    console.error('❌ Error fetching pharmacists from database:', error);
    res.status(500).json({ message: error.message });
  }
});

// Approve/Reject doctor
router.put('/doctors/:id/approve', async (req, res) => {
  try {
    const { isApproved } = req.body;
    const doctor = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    ).select('-password');
    
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Activate/Deactivate user
router.put('/users/:id/status', async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get analytics dashboard
router.get('/analytics', async (req, res) => {
  try {
    const [
      totalUsers,
      totalDoctors,
      totalPatients,
      totalAppointments,
      totalOrders,
      totalRevenue,
      pendingDoctors,
      recentAppointments,
      recentOrders
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'doctor', isApproved: true }),
      User.countDocuments({ role: 'patient' }),
      Appointment.countDocuments(),
      Order.countDocuments({ paymentStatus: 'paid' }),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      User.countDocuments({ role: 'doctor', isApproved: false }),
      Appointment.find().populate('doctor', 'name').populate('patient', 'name').sort({ createdAt: -1 }).limit(10),
      Order.find().populate('patient', 'name').sort({ createdAt: -1 }).limit(10)
    ]);
    
    // Appointment trends (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const appointmentTrends = await Appointment.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      totalUsers,
      totalDoctors,
      totalPatients,
      totalAppointments,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingDoctors,
      recentAppointments,
      recentOrders,
      appointmentTrends
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all appointments
router.get('/appointments', async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    const appointments = await Appointment.find(query)
      .populate('doctor', 'name specialization')
      .populate('patient', 'name email')
      .sort({ appointmentDate: -1 });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('patient', 'name email')
      .populate('items.medicine')
      .populate('pharmacist', 'name')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

