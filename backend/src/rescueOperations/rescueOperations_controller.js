// rescueOperations_controller.js
const RescueOps = require('./rescueOperations_model');


// Get all reviews
exports.getAllOps = async (req,res) => {
  try {
    const rescueOps = await RescueOps.find();
    if (!rescueOps || rescueOps.length === 0) return res.status(404).json({ error: 'No operations found' });
    res.json(rescueOps);
  } catch (error) {
    console.error('Error fetching operations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get operation by ID
exports.getRescueOpById = async (req, res) => {
  try {
    const rescueOp = await RescueOps.findOne({ rescueOpsID: Number(req.params.rescueOpID) });
    if (!rescueOp) return res.status(404).json({ error: 'Operation not found' });
    res.json(rescueOp);
  } catch (error) {
    console.error('Error fetching operations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add a new operation
exports.addRescueOp = async (req, res) => {
  try {
    // Handle multiple images
    const imageFiles = req.files; // multer will populate this when using upload.array('images')
    const imageNames = imageFiles ? imageFiles.map(file => file.filename) : [];

    const newOp = new RescueOps({
      animalType: req.body.animalType,
      location: req.body.location,
      priorityLevel: req.body.priorityLevel,
      assignedTeam: req.body.assignedTeam || 0,
      teamNotes: req.body.teamNotes || null,
      animalBehaviour: req.body.animalBehaviour || null,
      remarks: req.body.remarks || null,
      images: imageNames,
      date: req.body.date || Date.now(),
      opsStatus: req.body.opsStatus || "pending"
    });

    const savedOp = await newOp.save();
    res.status(201).json(savedOp);
  } catch (error) {
    console.error('Error adding rescue operation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// update operation
exports.updateRescueOp = async (req, res) => {

  try {
    
    const rescueOp = await RescueOps.findOne({ rescueOpsID: Number(req.params.rescueOpID) });
    
    if (!rescueOp) return res.status(404).json({ error: 'Operation not found' });

    rescueOp.opsStatus = req.body.opsStatus ?? rescueOp.opsStatus;
    rescueOp.assignedTeam = req.body.assignedTeam ?? rescueOp.assignedTeam;

    const updatedOp = await rescueOp.save();
    res.status(201).json(updatedOp);
  } catch (error) {
    console.error('Error adding team:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



// Delete review by ID
exports.deleteOps = async (req, res) => {
    console.log(req.params.rescueOpID)
  try {
    const deleted = await RescueOps.findOneAndDelete({ rescueOpsID: Number(req.params.rescueOpID) });
    if (!deleted) return res.status(404).json({ error: 'Operation not found' });
    res.json({ message: 'Operation deleted successfully' });
  } catch (error) {
    console.error('Error deleting operation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// rescueOperations_controller.js
exports.getSpeciesStats = async (req, res) => {
  try {
    const stats = await RescueOps.aggregate([
      { $group: { _id: "$animalType", count: { $sum: 1 } } }
    ]);
    res.json(stats); // returns [{_id:"Dog", count:10}, ...]
  } catch (err) {
    console.error("Error fetching species stats:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
