const DaycareIncident = require("./daycare_incident_model");

// Get all incidents
exports.getAllIncidents = async (req, res) => {
  try {
    const incidents = await DaycareIncident.find().sort({ date: -1 });
    res.json(incidents);
  } catch (err) {
    console.error("Error fetching incidents:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get single incident by id
exports.getIncident = async (req, res) => {
  try {
    const inc = await DaycareIncident.findById(req.params.id);
    if (!inc) return res.status(404).json({ error: "Incident not found" });
    res.json(inc);
  } catch (err) {
    console.error("Error fetching incident:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create incident
exports.addIncident = async (req, res) => {
  try {
    const inc = new DaycareIncident(req.body);
    const saved = await inc.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error adding incident:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update incident
exports.updateIncident = async (req, res) => {
  try {
    const updated = await DaycareIncident.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Incident not found" });
    res.json(updated);
  } catch (err) {
    console.error("Error updating incident:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete incident
exports.deleteIncident = async (req, res) => {
  try {
    const deleted = await DaycareIncident.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Incident not found" });
    res.json({ message: "Incident deleted successfully" });
  } catch (err) {
    console.error("Error deleting incident:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
