const mongoose = require("mongoose");
const schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const activityLogSchema = new schema({
  petName: { type: String, required: true },  // ✅ Added Pet Name
  activityID: { type: Number, required: true, default: 0 },
  activity: { type: String, required: true },
  food: { type: String, default: null },
  notes: { type: String, default: null },
  file: { type: String, default: null }, // file path
  date: { type: Date, default: Date.now },
});

// ✅ Auto-increment
activityLogSchema.plugin(AutoIncrement, {
  inc_field: "activityID",
  start_seq: 1000,
});

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema,'activitylogs');
module.exports = ActivityLog;
