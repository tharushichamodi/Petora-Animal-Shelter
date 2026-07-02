// api/vetScheduler_Api.js
const express = require('express');
const router = express.Router();

const vetSchedulerController = require('./vetSheduler_controller');

router.get('/:id', vetSchedulerController.getAppointmentById);
router.get('/', vetSchedulerController.getAllAppointments);
router.post('/', vetSchedulerController.addAppointment);
router.put('/:id', vetSchedulerController.updateAppointment);
router.delete('/:id', vetSchedulerController.deleteAppointment);

module.exports = router;
