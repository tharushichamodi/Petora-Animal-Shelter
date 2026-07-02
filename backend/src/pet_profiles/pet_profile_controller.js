const PetProfile = require('./pet_profile_model');

// Create new pet profile
exports.createPetProfile = async (req, res) => {
    try {
        const profileData = req.body;
        const imagePaths = (req.files || []).map(f => `${f.filename}`);

        // merge into the data you save
        const newProfile = await PetProfile.create({
        ...profileData,
        images: imagePaths
        });
        console.log("Created new pet profile:", newProfile);

        res.status(201).json({
        message: "Pet profile created successfully",
        data: newProfile
        });
    } catch (error) {
        console.error("Error creating pet profile:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// Get all pet profiles
exports.getAllPetProfiles = async (req, res) => {
    try {
        const profiles = await PetProfile.find().sort({ createdAt: -1 });
        res.status(200).json(profiles);
    } catch (error) {
        console.error("Error fetching pet profiles:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// Get single pet profile by ID
exports.getPetProfileById = async (req, res) => {
    try {
        const profile = await PetProfile.findById(req.params.id);
        if (!profile) {
            return res.status(404).json({ message: "Pet profile not found" });
        }
        res.status(200).json(profile);
    } catch (error) {
        console.error("Error fetching pet profile:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// Update pet profile by ID
exports.updatePetProfile = async (req, res) => {
    try {
        const updated = await PetProfile.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updated) {
            return res.status(404).json({ message: "Pet profile not found" });
        }
        res.status(200).json({ message: "Pet profile updated", data: updated });
    } catch (error) {
        console.error("Error updating pet profile:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// Delete pet profile by ID
exports.deletePetProfile = async (req, res) => {
    try {
        const deleted = await PetProfile.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Pet profile not found" });
        }
        res.status(200).json({ message: "Pet profile deleted", data: deleted });
    } catch (error) {
        console.error("Error deleting pet profile:", error);
        res.status(500).json({ message: "Server error", error });
    }
};