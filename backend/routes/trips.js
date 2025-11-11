const express = require('express');
const db = require('../config/database');
const router = express.Router();

// Get all trips for user
router.get('/', async (req, res) => {
  try {
    const trips = await db('trips')
      .select('*')
      .orderBy('created_at', 'desc');
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

// Get user stats
router.get('/stats', async (req, res) => {
  try {
    const totalTrips = await db('trips').count('* as count').first();
    res.json({
      totalTrips: parseInt(totalTrips.count),
      totalSpent: 0,
      activeTrips: 0,
      pendingAmount: 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Test route
router.post('/test', (req, res) => {
  res.json({ success: true, message: 'Backend is working', data: req.body });
});

// Create trip
router.post('/', async (req, res) => {
  try {
    console.log('Received trip creation request:', req.body);
    
    const { name, mode, startDate, endDate, plannedBudget, currency } = req.body;
    
    // Simple validation
    if (!name || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required fields: name, startDate, endDate' });
    }
    
    const tripData = {
      name: name,
      mode: mode || 'individual',
      start_date: startDate,
      end_date: endDate,
      planned_budget: plannedBudget || 0,
      currency: currency || 'LKR',
      status: 'planning',
      created_by: 1,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    console.log('Inserting trip data:', tripData);
    
    const [trip] = await db('trips')
      .insert(tripData)
      .returning('*');
    
    console.log('Trip created successfully:', trip);
    res.status(201).json({ success: true, trip });
  } catch (error) {
    console.error('Trip creation error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to create trip', 
      details: error.message,
      code: error.code 
    });
  }
});

// Delete trip
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedRows = await db('trips')
      .where('id', id)
      .del();
    
    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    
    res.json({ success: true, message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Trip deletion error:', error);
    res.status(500).json({ error: 'Failed to delete trip' });
  }
});

module.exports = router;