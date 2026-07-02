// api/grooming_packages_Api.js
const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const packageController = require("./grooming_packages_controller");

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const safeName = file.originalname.replace(/\s+/g, '_'); // replace spaces
    cb(null, safeName);
  }
});

const upload = multer({ storage });

// Routes
// Get all grooming packages
router.get("/", packageController.getAllPackages);

// Get a single grooming package by ID
router.get("/:id", packageController.getPackageById);

// Add a new grooming package (with image upload)
router.post("/", upload.single('photo'), packageController.addPackage);

// Update a grooming package by ID (with image upload)
router.put("/:id", upload.single('photo'), packageController.updatePackageById);

// Delete a grooming package by ID
router.delete("/:id", packageController.deletePackageById);

module.exports = router;
