// api/daycare_booking_Api.js
const express = require('express');
const router = express.Router();

const bookingController = require('./daycare_booking_controller');

// Get all bookings
router.get('/', bookingController.getAllBookings);

// Get booking by ID
router.get('/:id', bookingController.getBooking);

// Add a new booking
router.post('/', bookingController.addBooking);

// Update booking by ID
router.put('/:id', bookingController.updateBooking);

// Delete booking by ID
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;
