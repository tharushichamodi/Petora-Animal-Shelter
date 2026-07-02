//rescue_team_model.js
const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);


const rescueTeamSchema = new schema({
  rescueTeamID: {
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
  leaderID: {
    type: Number,
    required: true,
    default: 0,
  },
  members: {
    type: [Number], // ✅ Array of user IDs
    default: [],
  },
  noOfMem: {
    type: Number,
    required: true,
    default:0
  },
  remarks:{
    type:String,
    default:null
  },
  ops: {
    type: Number,
    required:true,
    default:0
  },
  successRate:{
    type:String,
    default:"0%"
  },
  availability:{
    type:Boolean,
    default: false,

  }
});

rescueTeamSchema.plugin(AutoIncrement, { inc_field: 'rescueTeamID', start_seq: 1000 });

const RescueTeams = mongoose.model('RescueTeams', rescueTeamSchema, "rescueTeams"); 
module.exports = RescueTeams;