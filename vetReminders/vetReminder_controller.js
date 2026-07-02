// controllers/vetReminder_controller.js
const VetReminder = require('./vetReminder_model');

// Get all reminders
exports.getAllReminders = async (req, res) => {
  try {
    const reminders = await VetReminder.find();
    if (!reminders || reminders.length === 0) {
      return res.status(404).json({ error: 'No reminders found' });
    }
    res.json(reminders);
  } catch (error) {
    console.error('Error fetching reminders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get reminder by ID
exports.getReminderById = async (req, res) => {
  try {
    const reminder = await VetReminder.findById(req.params.id);
    if (!reminder) return res.status(404).json({ error: 'Reminder not found' });
    res.json(reminder);
  } catch (error) {
    console.error('Error fetching reminder:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add a new reminder
exports.addReminder = async (req, res) => {
  try {
    const newReminder = new VetReminder(req.body);
    const savedReminder = await newReminder.save();
    res.status(201).json(savedReminder);
  } catch (error) {
    console.error('Error adding reminder:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update reminder by ID
exports.updateReminder = async (req, res) => {
  try {
    const updatedReminder = await VetReminder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedReminder) return res.status(404).json({ error: 'Reminder not found' });
    res.json(updatedReminder);
  } catch (error) {
    console.error('Error updating reminder:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete reminder by ID
exports.deleteReminder = async (req, res) => {
  try {
    const deleted = await VetReminder.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Reminder not found' });
    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
