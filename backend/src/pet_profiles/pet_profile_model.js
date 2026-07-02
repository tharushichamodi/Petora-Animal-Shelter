//employee_model.js

const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);


const petProfileSchema = new schema({
  petID: {
    type: Number,
    required: true,
    unique: true,
    default: 0
  },
  type: {
    type: String,
    required: true
  },
  userID: {
    type: Number,
    required: true,
    default: 0
  },
  name: {
    type: String,
    required: true,
    trim: true
  },

  gender: {
    type: String,
    required: true,
    default: 'Unknown'
  },

    age: {
    type: Number,
    required: true,
    default: 0
  },
    breed: {    
    type: String,
    required: true,
    default: 'Unknown'
  },
  images: {
    type: [String],
    default: []
  },
  color: {
    type: String,
    required: true,
    default: 'Unknown'
  },
  shelterAdopted: {
    type: String,
    required: true,
    default: "Unknown"
  },
});



petProfileSchema.plugin(AutoIncrement, { inc_field: 'petID', start_seq: 1000 });
const PetProfile = mongoose.model('PetProfile', petProfileSchema, 'petProfiles');
module.exports = PetProfile;