//employee_model.js

const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);


const trainerSchema = new schema({
  trainerID: {
    type: Number,
    required: true,
    unique: true,
    default:0

  },
  userID: {
    type: Number,
    required: true,
    unique: true
  },
  experience: {
    type: Number,
    required: true,
    default:0
  },
  ratings:{
    type: Number,
    required: true,
    default:0
  },
  completedSessions:{
    type:Number,
    required:true,
    default:0
  },
  completedTrainings:{
    type:Number,
    required:true,
    default:0
  },
  availability:{
    type:Boolean,
    required:true,
    default:false
  }
});



trainerSchema.plugin(AutoIncrement, { inc_field: 'trainerID', start_seq: 1000 });
const Trainer = mongoose.model('Trainer', trainerSchema, 'trainers');
module.exports = Trainer;