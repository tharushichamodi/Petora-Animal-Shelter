// api/review_api.js
const express = require('express');
const router = express.Router();

const reviewController = require('./review_controller');

router.get('/:id', reviewController.getReview);
router.get('/', reviewController.getAllReviews);
router.post('/', reviewController.addReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
