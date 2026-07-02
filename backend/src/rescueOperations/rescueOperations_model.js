//rescue_member_model.js

const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);


const rescueOpsSchema = new schema({
  rescueOpsID: {
    type: Number,
    required: true,
    unique: true,
    default:0
  },
  animalType: {
    type: String,
    required: true,
    default:null
  },
  location:{
    type: String,
    required: true,
    default:null
  },
  priorityLevel: {
    type: String,
    required: true,
    default:null
  },
  assignedTeam:{
    type:Number,
    default:0
  },
  teamNotes:{
    type:String,
    default:null
  },
   animalBehaviour: {  // fixed typo
    type: String,
    default: null
  },
  remarks:{
    type:String,
    default:null
  },
  images:{
    type:[String],
    default:[]
  },
  date:{
    type:Date,
    default:Date.now
  },
  opsStatus:{
    type:String,
    default:"pending"
  }
  
});



rescueOpsSchema.plugin(AutoIncrement, { inc_field: 'rescueOpsID', start_seq: 1000 });
const RescueOps = mongoose.model('RescueOps', rescueOpsSchema, 'rescueOps'); 
module.exports = RescueOps;