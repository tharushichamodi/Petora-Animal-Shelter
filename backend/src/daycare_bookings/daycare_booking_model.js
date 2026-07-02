// models/daycare_booking_model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const bookingSchema = new Schema({
  bookingID: {
    type: Number,
    required: true,
    default: 0,
  },
  animalName: {
    type: String,
    required: true,
  },
  species: {
    type: String,
    required: true,
  },
  admissionDate: {
    type: Date,
    required: true,
  },
  reason: {
    type: String,
    default: null,
  },
  vaccination: {
    type: String,
    enum: ['Completed', 'Pending'],
    default: 'Pending',
  },
  medicalNotes: {
    type: String,
    default: null,
  },
  assignedStaff: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ['Pending Intake', 'Checked-In', 'Discharged'],
    default: 'Pending Intake',
  },
}, { timestamps: true });

// Auto-increment bookingID starting at 1000
bookingSchema.plugin(AutoIncrement, { inc_field: 'bookingID', start_seq: 1000 });

const Booking = mongoose.model('daycare_bookings', bookingSchema);
module.exports = Booking;
