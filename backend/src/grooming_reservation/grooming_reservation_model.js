// api/grooming_reservation_model.js

const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const schema = mongoose.Schema;

const groomingReservationSchema = new schema({
  resID: {
    type: Number,
    unique: true
  },
  pet: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    species: { type: String, required: true }
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  package: {
    id: String,
    name: String,
    duration: String,
    price: Number
  },
  groomer: {
    id: String,
    name: String,
    rating: Number,
    jobs: Number
  },
  notes: String,
  status: {
    type: String,
    default: "Pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// auto increment of the resID field
groomingReservationSchema.plugin(AutoIncrement, { inc_field: 'resID', start_seq: 1000 });

const GroomingReservation = mongoose.model('GroomingReservation', groomingReservationSchema);
module.exports = GroomingReservation;
