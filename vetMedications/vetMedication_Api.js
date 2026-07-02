// api/vetMedication_Api.js
const express = require('express');
const router = express.Router();

const medController = require('./vetMedication_controller');

router.get('/:medicationsId', medController.getMedicationById);
router.get('/', medController.getAllMedications);
router.post('/', medController.addMedication);
router.put('/:medicationsId', medController.updateMedicationById);
router.delete('/:medicationsId', medController.deleteMedicationById);

module.exports = router;
