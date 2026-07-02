// api/review_api.js
const express = require('express');
const router = express.Router();

const empController = require('./trainer_controller');


router.get('/', empController.getAllTrainers);
router.post('/', empController.addTrainer);
// router.put('/:trainerID', empController.updateTrainerById);
router.delete('/:trainerID', empController.deleteTrainerById);


module.exports = router;
