//rescue_team_model.js
const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);


const TrainingPackagesSchema = new schema({
  trainingPackageID: {
    type: Number,
    required: true,
    default:0

  },
  name: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
    default: null,
  },
  description: {
    type: String,
    required: true,
  },
    price: {
    type: Number,
    required: true,
    default:0
    },
    duration: {
    type: String,
    required: true,
    default:"0"
    },
    ratings:{
    type: Number,
    default:0
  },
  noOfRatings:{
    type: Number,
    required: true, 
  },
  petType:{
    type: String,
    required: true,
    default:"none"
  },
  availability:{
    type:Boolean,
    default: false,

  }
});

TrainingPackagesSchema.plugin(AutoIncrement, { inc_field: 'trainingPackageID', start_seq: 1000 });

const TrainingPackages = mongoose.model('TrainingPackages', TrainingPackagesSchema, "trainingPackages");
module.exports = TrainingPackages;