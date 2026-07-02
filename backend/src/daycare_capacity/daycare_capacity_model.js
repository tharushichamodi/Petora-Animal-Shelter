// models/daycare_capacity_model.js
const mongoose = require('mongoose');

const capacitySchema = new mongoose.Schema(
  {
    dailyCapacity: {
      type: Number,
      required: true,
      min: [1, 'Capacity must be at least 1'],
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'daycare_capacity' } // optional, specify collection name
);

module.exports = mongoose.model('DaycareCapacity', capacitySchema);
