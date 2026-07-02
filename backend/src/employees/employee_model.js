//employee_model.js

const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);


const employeeSchema = new schema({
  empID: {
    type: Number,
    required: true,
    unique: true
  },
  userID: {
    type: Number,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  LastName: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,    
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  userName:{
    type:String,
    required:true
  },
  birthday:{
    type:Date
  },
  gender: {
    type: String,
  },
  role: {
    type: String,
    required: true,
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true

  },
  salary: {
    type: Number,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  hireDate: {
    type: Date,
    default: Date.now
  },
  
  profilePic: {
    type: String
  },
 
  status:{
    type:String,

  },
  lastLogin:{
    type:Date
  },
  shift:{
    type:String
  },
  shiftStart:{
    type:String
  },
  shiftEnd:{
    type:String
  }
});



employeeSchema.plugin(AutoIncrement, { inc_field: 'empID', start_seq: 1000 });
const Employee = mongoose.model('Employee', employeeSchema, 'empDetails'); 
module.exports = Employee;