// api/grooming_reservation_api.js
const express = require('express');
const router = express.Router();

const reservationController = require('./grooming_reservation_controller');

// Get a reservation by ID
router.get('/:id', reservationController.getReservationById);

// Get all reservations
router.get('/', reservationController.getAllReservations);

// Add a new reservation
router.post('/', reservationController.addReservation);


// Update a reservation by ID
router.put('/:id', reservationController.updateReservationById);

// Delete a reservation by ID
router.delete('/:id', reservationController.deleteReservationById);



// Update status only
router.put('/:id/status', reservationController.updateReservationStatus);

// PUT /:id/status
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const reservation = await GroomingReservation.findById(req.params.id);

    if (!reservation) return res.status(404).json({ error: "Reservation not found" });

    // If approving, check conflict
    if (status === "Approved") {
      const conflict = await GroomingReservation.findOne({
        _id: { $ne: reservation._id },
        groomer: reservation.groomer,
        date: reservation.date,
        time: reservation.time,
        status: "Approved",
      });

      if (conflict) {
        return res.status(400).json({
          error: "Another reservation for this groomer at the same date and time is already approved",
        });
      }
    }

    reservation.status = status;
    await reservation.save();

    res.json(reservation);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
