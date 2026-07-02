// models/medication_model.js
const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const medicationSchema = new mongoose.Schema(
  {
    medID: {
      type: Number,
      required: true,
      default: 0,
    },
    petName: {
      type: String,
      required: true,
      trim: true,
    },
    medication: {
      type: String,
      required: true,
      trim: true,
    },
    dosage: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      default: null,
    },
    given: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Auto-increment medication ID starting from 1000
medicationSchema.plugin(AutoIncrement, {
  inc_field: "medID",
  start_seq: 1000,
});

const Medication = mongoose.model("Medication", medicationSchema, "medications");

module.exports = Medication;
