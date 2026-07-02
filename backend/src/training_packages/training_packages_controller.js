// rescue_team_controller.js
const TrainingPackages = require('./training_packages_model');

// Get all reviews
exports.getAllTrainingPackages = async (req,res) => {
  try {
    const trainingPackages = await TrainingPackages.find();
    if (!trainingPackages || trainingPackages.length === 0) return res.status(404).json({ error: 'No packages found' });
    res.json(trainingPackages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Add a new review
exports.addTrainingPackage = async (req, res) => {

  try {
     const members = req.body.members ? JSON.parse(req.body.members) : [];
      const newTeam = new TrainingPackages({
        name: req.body.name,
        leaderID: req.body.leaderID,
        members: members, // store array of user IDs
        remarks: req.body.remarks,
        availability: req.body.status === 'active' ? true : false,
        img: req.file ? req.file.filename : null,
        noOfMem: req.body.noOfMem
      });

      const savedTeam = await newTeam.save();
    res.status(201).json(savedTeam);
  } catch (error) {
    console.error('Error adding package:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// update package
exports.updateTrainingPackage = async (req, res) => {

  try {
    const trainingPackage = await TrainingPackages.findOne({trainingPackageID:Number(req.params.trainingPackageID)});
    if (!trainingPackage) return res.status(404).json({ error: 'Package not found' });

    trainingPackage.name = req.body.name ?? trainingPackage.name;
    trainingPackage.availability = req.body.status ? req.body.status === 'active' : trainingPackage.availability;
    trainingPackage.img = req.file ? req.file.filename : trainingPackage.img;
    console.log(trainingPackage.img)
    const updatedTeam = await rescueTeam.save();
    res.status(201).json(updatedTeam);
  } catch (error) {
    console.error('Error adding package:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



// Delete review by ID
exports.deleteTrainingPackage = async (req, res) => {
  try {
    const deleted = await TrainingPackages.findOneAndDelete({trainingPackageID:Number(req.params.trainingPackageID)});
    if (!deleted) return res.status(404).json({ error: 'Package not found' });
    res.json({ message: 'Package deleted successfully' });
  } catch (error) {
    console.error('Error deleting package:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
