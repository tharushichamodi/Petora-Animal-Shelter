// rescue_team_controller.js
const RescueTeams = require('./rescue_team_model');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // folder where files are saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique file name
  }
});

const upload = multer({ storage });

// Get all reviews
exports.getAllTeams = async (req,res) => {
  try {
    const rescueTeams = await RescueTeams.find();
    if (!rescueTeams || rescueTeams.length === 0) return res.status(404).json({ error: 'No teams found' });
    res.json(rescueTeams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get review by ID
exports.getRescueTeamById = async (req, res) => {
  try {
    const rescueTeams = await RescueTeams.findOne({rescueTeamID:Number(req.params.rescueTeamID)});
    if (!rescueTeams) return res.status(404).json({ error: 'Team not found' });
    res.json(rescueTeams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add a new review
exports.addRescueTeam = async (req, res) => {

  try {
     const members = req.body.members ? JSON.parse(req.body.members) : [];
      const newTeam = new RescueTeams({
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
    console.error('Error adding team:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// update team
exports.updateRescueTeam = async (req, res) => {

  try {
    const rescueTeam = await RescueTeams.findOne({rescueTeamID:Number(req.params.rescueTeamID)});
    if (!rescueTeam) return res.status(404).json({ error: 'Team not found' });
    
    rescueTeam.name = req.body.name ?? rescueTeam.name;
    rescueTeam.availability = 
      req.body.availability !== undefined 
        ? req.body.availability === true || req.body.availability === 'true'
        : rescueTeam.availability;
    rescueTeam.img = req.file ? req.file.filename : rescueTeam.img;
    console.log(rescueTeam.img)
    const updatedTeam = await rescueTeam.save();
    res.status(201).json(updatedTeam);
  } catch (error) {
    console.error('Error adding team:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



// Delete review by ID
exports.deleteRescueTeam = async (req, res) => {
  try {
    const deleted = await RescueTeams.findOneAndDelete({rescueTeamID:Number(req.params.rescueTeamID)});
    if (!deleted) return res.status(404).json({ error: 'Team not found' });
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
