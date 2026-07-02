
const express = require('express');
const router = express.Router();

const animMedicalController = require('./vetAnimalMedical_controller');

router.get('/:id', animMedicalController.getProfileById);
router.get('/', animMedicalController.getAllProfiles);
router.post('/', animMedicalController.addProfile);
router.put('/:id', animMedicalController.updateProfile);
router.delete('/:id', animMedicalController.deleteProfile);

module.exports = router;
