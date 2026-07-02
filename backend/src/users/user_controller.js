// controllers/review_controller.js
const User = require('./user_model');

// Get all reviews
exports.getAllUsers = async (req,res) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) return res.status(404).json({ error: 'No Users found' });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get review by ID
exports.getUser = async (req, res) => {
  try {
    console.log("debug")
    const user = await Users.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Add a new review
exports.addUser = async (req, res) => {
  try {
    const newUser = new User(req.body); // Assumes req.body has all required fields
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error adding User:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete review by ID
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
