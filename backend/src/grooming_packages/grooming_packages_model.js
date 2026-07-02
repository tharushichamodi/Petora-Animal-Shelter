// api/grooming_packages_model.js

const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const schema = mongoose.Schema;

const groomingPackageSchema = new schema({
  packageID: {
    type: Number,
    unique: true
  },
  packageName: {
    type: String,
    required: true
  },
  servicesIncluded: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  species: {
    type: [String], // multiple species (dog, cat, rabbit, etc.)
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  photo: {
    type: String, // store image URL or file path
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// auto increment packageID field
groomingPackageSchema.plugin(AutoIncrement, { inc_field: "packageID", start_seq: 1 });

const GroomingPackage = mongoose.model("GroomingPackage", groomingPackageSchema, );
module.exports = GroomingPackage;
