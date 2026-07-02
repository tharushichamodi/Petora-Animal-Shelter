const express = require("express");
const router = express.Router();
//const multer = require("multer");
const path = require("path");

const activityLogController = require("./daycare_activitylog_controller");

// ✅ Multer storage config
//const storage = multer.diskStorage({
  //destination: (req, file, cb) => {
    //cb(null, "uploads/");
  //},
  //filename: (req, file, cb) => {
    //cb(null, Date.now() + path.extname(file.originalname));
  //},
//});
//const upload = multer({ storage });

// ✅ Routes

// Get all activity logs
router.get("/", activityLogController.getAllActivityLogs);

// Get a single activity log by ID
router.get("/:id", activityLogController.getActivityLog);

// Add a new activity log
router.post("/", activityLogController.addActivityLog);

// Update an existing activity log
router.put("/:id", activityLogController.updateActivityLog);

// Delete an activity log
router.delete("/:id", activityLogController.deleteActivityLog);

module.exports = router;
