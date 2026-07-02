const AnimalProfile= require('./animal_profile_model');

exports.createAnimalProfile = async (req, res) => {
  try {
    // If files were uploaded, get their filenames
    const photos = req.files ? req.files.map(file => file.filename) : [];
    console.log(req.body)
    console.log(photos)
    // Combine req.body with images
    const profileData = {
      ...req.body,
      photos // assuming your model has an 'images' field (array of strings)
    };

    const profile = await AnimalProfile.create(profileData);
    res.status(201).json(profile);
  } catch (error) {
    console.error("Error creating animal profile:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Get all animal profiles
exports.getAllAnimalProfiles = async (req, res) => {
    try {
        const profiles = await AnimalProfile.find();
        res.status(200).json(profiles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single animal profile by ID
exports.getAnimalProfileById = async (req, res) => {
    try {
        const profile = await AnimalProfile.findOne({ animalProfileID: (req.params.id)});
        if (!profile) {
            return res.status(404).json({ error: 'Animal profile not found' });
        }
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an animal profile by ID
exports.updateAnimalProfile = async (req, res) => {
    try {
        const updatedProfile = await AnimalProfile.findOneAndUpdate({ animalProfileID: req.params.animalId }, req.body, { new: true });
        if (!updatedProfile) {
            return res.status(404).json({ error: 'Animal profile not found' });
        }
        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete an animal profile by ID
exports.deleteAnimalProfile = async (req, res) => {
    try {
        const deleted = await AnimalProfile.findOneAndDelete({ animalProfileID: req.params.animalId });
        if (!deleted) {
            return res.status(404).json({ error: 'Animal profile not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};