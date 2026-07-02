// models/vetReminder_model.js
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const vetReminderSchema = new schema({
  reminderID: {
    type: Number,
    required: true,
    default: 0
  },
  petName: {
    type: String,
    required: true,
    default: null
  },
  category: {
    type: String,
    enum: ['Treatment', 'Vaccination', 'Surgery', 'Other'],
    default: 'Treatment'
  },
  treatment: {
    type: String,
    required: true,
    default: null
  },
  date: {
    type: String, // yyyy-mm-dd
    required: true,
    default: null
  },
  time: {
    type: String, // HH:mm
    default: null
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  recurring: {
    type: String,
    enum: ['None', 'Daily', 'Weekly', 'Monthly'],
    default: 'None'
  },
  completed: {
    type: Boolean,
    default: false
  },
  notified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

vetReminderSchema.plugin(AutoIncrement, { inc_field: 'reminderID', start_seq: 1000 });

const VetReminder = mongoose.model('VetReminder', vetReminderSchema, 'vet_Reminders');
module.exports = VetReminder;
