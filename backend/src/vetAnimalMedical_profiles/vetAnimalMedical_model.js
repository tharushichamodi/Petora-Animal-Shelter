// models/vetAnimalMedical_model.js
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const vetAnimalMedicalSchema = new schema({
  profileID: {
    type: Number,
    required: true,
    default: 0
  },
  name: {
    type: String,
    required: true,
    default: null
  },
  species: {
    type: String,
    required: true,
    default: null
  },
  age: {
    type: Number,
    required: true,
    default: 0
  },
  medicalHistory: {
    type: String,
    required: true,
    default: null
  },
  status: {
    type: String,
    enum: ["Healthy", "Under Treatment", "Critical"],
    default: "Healthy"
  },
  photo: {
    type: String,
    default: null
  },
  medicalDocuments: {
    type: [String],
    default: []
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-increment profileID
vetAnimalMedicalSchema.plugin(AutoIncrement, { 
  inc_field: 'profileID', 
  start_seq: 1000 
});

const VetProfile = mongoose.model('VetProfile', vetAnimalMedicalSchema, 'vet_medical_profile');
module.exports = VetProfile;
