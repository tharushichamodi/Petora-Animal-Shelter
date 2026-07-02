// training_bookings_controller.js
const TrainingBooking = require('./training_bookings_model');

// ──────────────────────────────────────────────
// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await TrainingBooking.find();
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ error: 'No bookings found' });
    }
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ──────────────────────────────────────────────
exports.updateBookingById = async (req, res) => {
  try {
    

    const booking = await TrainingBooking.findOne({
      trainingBookingID: Number(req.params.trainingBookingID),
    });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Update only the status if provided
    booking.status = req.body.status ?? booking.status;

    const updatedBooking = await booking.save();
    return res.status(200).json(updatedBooking);   // 200 OK for update
  } catch (error) {
    console.error('Error updating booking:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


// ──────────────────────────────────────────────
// Add a new booking
exports.addBooking = async (req, res) => {
  try {
    const newBooking = new TrainingBooking(req.body); // expects validated req.body
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error('Error adding booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ──────────────────────────────────────────────
// Delete booking by ID
exports.deleteBookingById = async (req, res) => {
  try {
    // if you want to delete using Mongo's _id, use findByIdAndDelete
    const deletedBooking = await TrainingBooking.findByIdAndDelete(req.params.trainingBookingID);
    if (!deletedBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

