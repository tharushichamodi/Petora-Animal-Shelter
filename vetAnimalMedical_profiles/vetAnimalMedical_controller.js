
const VetProfile = require('./vetAnimalMedical_model');

// Get all profiles
exports.getAllProfiles = async (req, res) => {
  try {
    const profiles = await VetProfile.find();
    if (!profiles || profiles.length === 0) {
      return res.status(404).json({ error: 'No profiles found' });
    }
    res.json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get profile by ID
exports.getProfileById = async (req, res) => {
  try {
    const profile = await VetProfile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add a new profile
exports.addProfile = async (req, res) => {
  try {
    console.log("error")
    const newProfile = new VetProfile(req.body); // assumes req.body has fields
    const savedProfile = await newProfile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    console.error('Error adding profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update profile by ID
exports.updateProfile = async (req, res) => {
  try {
    const updatedProfile = await VetProfile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(updatedProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete profile by ID
exports.deleteProfile = async (req, res) => {
  try {
      console.log("error")
    const deleted = await VetProfile.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
