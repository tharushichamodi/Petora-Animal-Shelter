// api/grooming_reservation_controller.js

const GroomingReservation = require('./grooming_reservation_model.js');

exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await GroomingReservation.find();
    if (!reservations || reservations.length === 0)
      return res.status(404).json({ error: 'No reservations found' });
    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getReservationById = async (req, res) => {
  try {
    const reservation = await GroomingReservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
    res.json(reservation);
  } catch (error) {
    console.error('Error fetching reservation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.addReservation = async (req, res) => {
  try {
    console.log("📩 Incoming reservation data:", req.body);  // <-- ADD THIS
    const newReservation = new GroomingReservation(req.body);
    const savedReservation = await newReservation.save();
    res.status(201).json(savedReservation);
  } catch (error) {
    console.error("❌ Error adding reservation:", error.message); // <-- SHOW only the reason
    res.status(500).json({ error: error.message });
  }
};

exports.updateReservationById = async (req, res) => {
  try {
    const updatedReservation = await GroomingReservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedReservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.json(updatedReservation);
  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteReservationById = async (req, res) => {
  try {
    const deletedReservation = await GroomingReservation.findByIdAndDelete(req.params.id);
    if (!deletedReservation) return res.status(404).json({ error: 'Reservation not found' });
    res.json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update reservation STATUS only
exports.updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedReservation = await GroomingReservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedReservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    res.json(updatedReservation);
  } catch (error) {
    console.error("Error updating reservation status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

