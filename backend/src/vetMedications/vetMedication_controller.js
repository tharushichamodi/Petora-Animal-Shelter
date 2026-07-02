// controllers/vetMedication_controller.js
const Medication = require("./vetMedication_model");

// Get all medications
exports.getAllMedications = async (req, res) => {
  try {
    const medications = await Medication.find().sort({ date: 1, time: 1 });
    if (!medications || medications.length === 0) {
      return res.status(404).json({ error: "No medications found" });
    }
    res.json(medications);
  } catch (error) {
    console.error("Error fetching medications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a medication by ID
exports.getMedicationById = async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.medicationsId);
    if (!medication) return res.status(404).json({ error: "Medication not found" });
    res.json(medication);
  } catch (error) {
    console.error("Error fetching medication:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add a new medication
exports.addMedication = async (req, res) => {
  try {
    const newMedication = new Medication(req.body); // assumes req.body has all required fields
    const savedMedication = await newMedication.save();
    res.status(201).json(savedMedication);
  } catch (error) {
    console.error("Error adding medication:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a medication by ID
exports.updateMedicationById = async (req, res) => {
  try {
    const updatedMedication = await Medication.findByIdAndUpdate(req.params.medicationsId, req.body, { new: true });
    if (!updatedMedication) return res.status(404).json({ error: "Medication not found" });
    res.json(updatedMedication);
  } catch (error) {
    console.error("Error updating medication:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a medication by ID
exports.deleteMedicationById = async (req, res) => {
  try {
    const deletedMedication = await Medication.findByIdAndDelete(req.params.medicationsId);
    if (!deletedMedication) return res.status(404).json({ error: "Medication not found" });
    res.json({ message: "Medication deleted successfully" });
  } catch (error) {
    console.error("Error deleting medication:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
