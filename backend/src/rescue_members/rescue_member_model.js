//rescue_member_model.js

const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);


const rescueMemberSchema = new schema({
  rescuerID: {
    type: Number,
    required: true,
    unique: true,
    default:0
  },
  
  empID:{
    type: Number,
    required: true,
    unique: true,
    default:0
  },
  RescueTeamID:{
    type:Number,
    default:0
    
  },availability:{
    type:Boolean,
    default:false
  }
});



rescueMemberSchema.plugin(AutoIncrement, { inc_field: 'rescueMemberID', start_seq: 1000 });
const RescueMember = mongoose.model('RescueMember', rescueMemberSchema, 'rescuers'); 
module.exports = RescueMember;