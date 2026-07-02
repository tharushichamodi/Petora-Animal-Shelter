// controllers/daycare_booking_controller.js
const Booking = require('./daycare_booking_model'); // <-- your Mongoose model

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    if (!bookings || bookings.length === 0) {
      // Return empty list with 200 OK to simplify frontend handling
      return res.json([]);
    }
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get booking by ID
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add a new booking
exports.addBooking = async (req, res) => {
  try {
    const newBooking = new Booking(req.body); // assumes body matches schema
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error('Error adding booking:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'ValidationError', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update booking by ID
exports.updateBooking = async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(updated);
  } catch (error) {
    console.error('Error updating booking:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'ValidationError', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete booking by ID
exports.deleteBooking = async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
