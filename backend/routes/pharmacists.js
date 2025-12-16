const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Get all pharmacists - Fetches directly from database
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const query = { role: 'pharmacist', isActive: true };
    
    if (search && search.trim()) {
      query.$or = [
        { name: new RegExp(search.trim(), 'i') },
        { email: new RegExp(search.trim(), 'i') },
        { pharmacyName: new RegExp(search.trim(), 'i') },
        { licenseNumber: new RegExp(search.trim(), 'i') }
      ];
    }
    
    // Fetch directly from MongoDB database
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

// Get pharmacist by ID
router.get('/:id', async (req, res) => {
  try {
    const pharmacist = await User.findOne({ 
      _id: req.params.id, 
      role: 'pharmacist' 
    }).select('-password');
    
    if (!pharmacist) {
      return res.status(404).json({ message: 'Pharmacist not found' });
    }
    
    res.json(pharmacist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;


