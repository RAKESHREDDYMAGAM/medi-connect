const express = require('express');
const { auth } = require('../middleware/auth');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Appointment = require('../models/Appointment');
const Order = require('../models/Order');

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret'
});

// Create payment order for appointment
router.post('/appointment/create-order', auth, async (req, res) => {
  try {
    const { appointmentId } = req.body;
    
    const appointment = await Appointment.findById(appointmentId)
      .populate('doctor', 'consultationFee');
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    const amount = appointment.amount || appointment.doctor.consultationFee || 0;
    
    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `appointment_${appointmentId}`,
      notes: {
        appointmentId: appointmentId.toString(),
        type: 'appointment'
      }
    };
    
    const order = await razorpay.orders.create(options);
    
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create payment order for pharmacy
router.post('/pharmacy/create-order', auth, async (req, res) => {
  try {
    const { orderId } = req.body;
    
    const order = await Order.findById(orderId);
    
    if (!order || order.patient.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const options = {
      amount: order.totalAmount * 100, // Convert to paise
      currency: 'INR',
      receipt: `order_${orderId}`,
      notes: {
        orderId: orderId.toString(),
        type: 'pharmacy'
      }
    };
    
    const razorpayOrder = await razorpay.orders.create(options);
    
    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify payment
router.post('/verify', auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, type, id } = req.body;
    
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret')
      .update(text)
      .digest('hex');
    
    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }
    
    if (type === 'appointment') {
      const appointment = await Appointment.findByIdAndUpdate(
        id,
        {
          paymentStatus: 'paid',
          paymentId: razorpay_payment_id
        },
        { new: true }
      );
      
      res.json({ message: 'Payment successful', appointment });
    } else if (type === 'pharmacy') {
      const order = await Order.findByIdAndUpdate(
        id,
        {
          paymentStatus: 'paid',
          paymentId: razorpay_payment_id
        },
        { new: true }
      );
      
      res.json({ message: 'Payment successful', order });
    } else {
      res.status(400).json({ message: 'Invalid payment type' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;


