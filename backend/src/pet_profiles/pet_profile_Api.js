const express = require('express');
const router = express.Router();
const petProfileController = require('./pet_profile_controller');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Optional: prepend timestamp to avoid overwriting
    const safeName = file.originalname.replace(/\s+/g, '_'); // replace spaces
    cb(null,safeName);
  }
});
const upload = multer({ storage });

// Routes
router.post('/',upload.array('images', 5), petProfileController.createPetProfile);
router.get('/', petProfileController.getAllPetProfiles);
router.put('/:petProfileID',upload.array('images', 5), petProfileController.updatePetProfile);
router.delete('/:petProfileID', petProfileController.deletePetProfile);

module.exports = router;
