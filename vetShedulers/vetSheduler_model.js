// models/vetScheduler_model.js
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const vetSchedulerSchema = new schema({
  appointmentID: {
    type: Number,
    required: true,
    default: 0,
  },
  animalName: {
    type: String,
    required: true,
    default: null,
  },
  type: {
    type: String,
    enum: ['Checkup', 'Vaccination', 'Treatment', 'Surgery'],
    required: true,
    default: 'Checkup',
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true,
    default: null,
  },
  time: {
    type: String, // HH:mm
    required: true,
    default: null,
  },
});

vetSchedulerSchema.plugin(AutoIncrement, { inc_field: 'appointmentID', start_seq: 1000 });

const VetAppointment = mongoose.model('VetAppointment', vetSchedulerSchema,);
module.exports = VetAppointment;
