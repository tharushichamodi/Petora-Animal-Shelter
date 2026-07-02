// controllers/daycare_capacity_controller.js
const Capacity = require('../models/daycare_capacity_model');

// Get current daily capacity
exports.getDailyCapacity = async (req, res) => {
  try {
    let capacity = await Capacity.findOne();

    // If not found, create default record
    if (!capacity) {
      capacity = new Capacity({ dailyCapacity: 20 });
      await capacity.save();
    }

    res.json(capacity);
  } catch (error) {
    console.error('Error fetching capacity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update daily capacity
exports.updateDailyCapacity = async (req, res) => {
  try {
    const { dailyCapacity } = req.body;

    if (typeof dailyCapacity !== 'number' || dailyCapacity < 1) {
      return res.status(400).json({ error: 'Invalid dailyCapacity value' });
    }

    let capacity = await Capacity.findOne();
    if (!capacity) {
      capacity = new Capacity({ dailyCapacity });
    } else {
      capacity.dailyCapacity = dailyCapacity;
      capacity.lastUpdated = new Date();
    }

    const updated = await capacity.save();
    res.json(updated);
  } catch (error) {
    console.error('Error updating capacity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
