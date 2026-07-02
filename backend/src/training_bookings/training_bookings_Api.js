// api/training_Api.js
const express = require('express');
const router = express.Router();

const trainingBookingController = require('./training_bookings_controller');

router.get('/', trainingBookingController.getAllBookings);
router.post('/', trainingBookingController.addBooking);
router.put('/:trainingBookingID', trainingBookingController.updateBookingById);
router.delete('/:trainingBookingID', trainingBookingController.deleteBookingById);

module.exports = router;
