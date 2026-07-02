const ActivityLog = require("./daycare_activitylog_model");

// ✅ Get all activity logs
exports.getAllActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find();
    res.json(logs);
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    res.status(500).json({ error: "Internal server error" });//failed to fetch activitylogs
  }
};

// ✅ Get a single activity log by ID
exports.getActivityLog = async (req, res) => {
  try {
    const log = await ActivityLog.findById(req.params.id);
    if (!log) return res.status(404).json({ error: "Activity log not found" });
    res.json(log);
  } catch (error) {
    console.error("Error fetching activity log:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Add a new activity log
  exports.addActivityLog = async (req, res) => {
    try {
      const newLog = new ActivityLog(req.body); // req.body should have petName, activity, etc.
      const savedLog = await newLog.save();
      res.status(201).json(savedLog);
    } catch (error) {
      console.error("Error adding activity log:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

// ✅ Update an existing activity log
exports.updateActivityLog = async (req, res) => {
  try {
    const updated = await ActivityLog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Activity log not found" });
    }
    res.json(updated);
  } catch (error) {
    console.error("Error updating activity log:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Delete an activity log
exports.deleteActivityLog = async (req, res) => {
  try {
    const deleted = await ActivityLog.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Activity log not found" });
    res.json({ message: "Activity log deleted successfully" });
  } catch (error) {
    console.error("Error deleting activity log:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
