const mongoose = require("mongoose");

const IncidentSchema = new mongoose.Schema(
  {
    petName: { type: String, required: true },
    title: { type: String, required: true },
    severity: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
    action: { type: String, default: "" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const DaycareIncident = mongoose.model("DaycareIncident", IncidentSchema, "daycare_incidents");
module.exports = DaycareIncident;
