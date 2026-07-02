//model.js
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);


const reviewSchema = new schema({
  reviewID: {
    type: Number,
  },
  userID: {
    type: Number,
    required: true,
    default: 0,
  },
  departmentID: {
    type: Number,
    required: true,
    default: 0,
  },
  productID: {
    type: Number,
    required: true,
    default: 0,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  }
  ,
  comment: {
    type: String,
  },
});

reviewSchema.plugin(AutoIncrement, { inc_field: 'reviewID', start_seq: 1000 });

const Review = mongoose.model('Review', reviewSchema); 
module.exports = Review;