const express = require('express');
const router = express.Router();
const adoptionController = require('./adoption_application_controller');

// Routes
router.post('/', adoptionController.createApplication);
router.get('/', adoptionController.getAllApplications);
router.put('/:adoptionApplicationID', adoptionController.updateApplicationStatus);
router.delete('/:adoptionApplicationID', adoptionController.deleteApplication);

module.exports = router;
