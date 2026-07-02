// api/vetReminder_Api.js
const express = require('express');
const router = express.Router();

const vetReminderController = require('./vetReminder_controller');

router.get('/:id', vetReminderController.getReminderById);
router.get('/', vetReminderController.getAllReminders);
router.post('/', vetReminderController.addReminder);
router.put('/:id', vetReminderController.updateReminder);
router.delete('/:id', vetReminderController.deleteReminder);

module.exports = router;
