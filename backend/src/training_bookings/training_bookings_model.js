// training_bookings_model.js
const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const trainingBookingSchema = new schema({
  trainingBookingID: {
    type: Number,
    required: true,
    default: 0
  },
  userID: {
    type: Number,
    required: true,
    default: 0
  },
  trainerID: {
    type: Number,
    required: true,
    default: 0
  },
  petID: {
    type: Number,
    required: true,
    default: 0
  },
  date: {
    type: String,
    required: true,
    default: null
  },
  time: {
    type: String,
    required: true,
    default: null
  },
  packageID:{
    type:Number,
    default:0
  },
  status: {
    type: String,
    required: true,
    default: "Pending" // can be Pending, Approved, Completed
  },
  paymentDone:{
    type:Boolean,
    default:false
  }
});

trainingBookingSchema.plugin(AutoIncrement, { inc_field: 'trainingBookingID', start_seq: 1000 });

const TrainingBooking = mongoose.model('TrainingBooking', trainingBookingSchema, "trainingBookings");
module.exports = TrainingBooking;
