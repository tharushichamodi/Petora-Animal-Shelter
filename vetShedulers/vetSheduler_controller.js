// controllers/vetScheduler_controller.js
const VetAppointment = require('./vetSheduler_model');

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await VetAppointment.find();
    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ error: 'No appointments found' });
    }
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await VetAppointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add a new appointment
exports.addAppointment = async (req, res) => {
  try {
    const newAppointment = new VetAppointment(req.body);
    const savedAppointment = await newAppointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    console.error('Error adding appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update appointment by ID
exports.updateAppointment = async (req, res) => {
  try {
    const updated = await VetAppointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Appointment not found' });
    res.json(updated);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete appointment by ID
exports.deleteAppointment = async (req, res) => {
  try {
    const deleted = await VetAppointment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
