// controllers/review_controller.js
const Review = require('./review_model');

// Get all reviews
exports.getAllReviews = async (req,res) => {
  try {
    const reviews = await Review.find();
    if (!reviews || reviews.length === 0) return res.status(404).json({ error: 'No reviews found' });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get review by ID
exports.getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json(review);
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add a new review
exports.addReview = async (req, res) => {
  try {
    const newReview = new Review(req.body); // Assumes req.body has all required fields
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete review by ID
exports.deleteReview = async (req, res) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
