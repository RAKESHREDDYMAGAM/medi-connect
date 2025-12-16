const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const Medicine = require('../models/Medicine');
const Order = require('../models/Order');
const Prescription = require('../models/Prescription');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/prescriptions/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and PDF files are allowed'));
    }
  }
});

// Get all medicines
router.get('/medicines', async (req, res) => {
  try {
    const { search, category } = req.query;
    const query = { isActive: true };
    
    if (search && search.trim()) {
      query.$or = [
        { name: new RegExp(search.trim(), 'i') },
        { genericName: new RegExp(search.trim(), 'i') },
        { category: new RegExp(search.trim(), 'i') },
        { manufacturer: new RegExp(search.trim(), 'i') }
      ];
    }
    
    if (category && category.trim()) {
      query.category = new RegExp(category.trim(), 'i');
    }
    
    const medicines = await Medicine.find(query).sort({ name: 1 });
    res.json(medicines);
  } catch (error) {
    console.error('Error fetching medicines:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get medicine by ID
router.get('/medicines/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create order with prescription upload
router.post('/orders', auth, authorize('patient'), upload.single('prescriptionImage'), async (req, res) => {
  try {
    const { items, prescriptionId, shippingAddress } = req.body;
    
    let prescriptionImage = null;
    if (req.file) {
      prescriptionImage = `/uploads/prescriptions/${req.file.filename}`;
    }
    
    let prescription = null;
    if (prescriptionId) {
      prescription = await Prescription.findById(prescriptionId);
      if (!prescription || prescription.patient.toString() !== req.user.id) {
        return res.status(404).json({ message: 'Prescription not found' });
      }
    }
    
    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of JSON.parse(items)) {
      const medicine = await Medicine.findById(item.medicineId);
      if (!medicine || medicine.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${medicine?.name || 'medicine'}` 
        });
      }
      
      orderItems.push({
        medicine: medicine._id,
        quantity: item.quantity,
        price: medicine.price
      });
      
      totalAmount += medicine.price * item.quantity;
    }
    
    const order = await Order.create({
      patient: req.user.id,
      prescription: prescription?._id,
      prescriptionImage,
      items: orderItems,
      totalAmount,
      shippingAddress: shippingAddress ? JSON.parse(shippingAddress) : null
    });
    
    const populatedOrder = await Order.findById(order._id)
      .populate('items.medicine')
      .populate('patient', 'name email');
    
    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get orders (for pharmacist)
router.get('/orders', auth, authorize('pharmacist', 'admin'), async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    
    if (req.user.role === 'pharmacist') {
      query.pharmacist = req.user.id;
    }
    
    if (status) {
      query.status = status;
    }
    
    const orders = await Order.find(query)
      .populate('patient', 'name email phone')
      .populate('items.medicine')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (pharmacist)
router.put('/orders/:id/status', auth, authorize('pharmacist', 'admin'), async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (req.user.role === 'pharmacist' && order.pharmacist && order.pharmacist.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    order.status = status;
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    
    if (status === 'verified' && !order.pharmacist) {
      order.pharmacist = req.user.id;
    }
    
    // Update stock when order is verified
    if (status === 'verified') {
      for (const item of order.items) {
        await Medicine.findByIdAndUpdate(item.medicine, {
          $inc: { stock: -item.quantity }
        });
      }
    }
    
    await order.save();
    
    const populatedOrder = await Order.findById(order._id)
      .populate('items.medicine')
      .populate('patient', 'name email');
    
    res.json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add/Update medicine (pharmacist/admin)
router.post('/medicines', auth, authorize('pharmacist', 'admin'), async (req, res) => {
  try {
    const medicine = await Medicine.create(req.body);
    res.status(201).json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update medicine stock
router.put('/medicines/:id/stock', auth, authorize('pharmacist', 'admin'), async (req, res) => {
  try {
    const { stock } = req.body;
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true }
    );
    
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    
    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

