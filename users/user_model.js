//user_model.js
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);


const userSchema = new schema({
  userID: {
    type: Number,
    required: true,
    default:0
  },
  userEmail: {
    type: String,
    required: true,
    default: null,
  },
  password: {
    type: String,
    required: true,
    default: null,
  },
  userName: {
    type: String,
    required: true,
    default: null,
  },
  userType:{
    type:String,
    required: true,
    default:'customer',
  }
});

userSchema.plugin(AutoIncrement, { inc_field: 'userID', start_seq: 1000 });

const User = mongoose.model('User', userSchema); 
module.exports = User;