
const Trainer = require('./trainer_model.js');

exports.getAllTrainers = async (req,res) => {
  try {

    const trainers = await Trainer.find();
    if (!trainers || trainers.length === 0) return res.status(404).json({ error: 'No trainer found' });
    res.json(trainers);
  } catch (error) {
    console.error('Error fetching trainers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.addTrainer = async (req, res) => {
  try {
    const newTrainer = new Trainer(req.body); // Assumes req.body has all required fields
    const savedTrainer = await newTrainer.save();
    res.status(201).json(savedTrainer);
  } catch (error) {
    console.error('Error adding trainer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteTrainerById = async (req, res) => {
  try {
    const deletedTrainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!deletedTrainer) return res.status(404).json({ error: 'Trainer not found' });
    res.json({ message: 'Trainer deleted successfully' });
  } catch (error) {
    console.error('Error deleting trainer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


