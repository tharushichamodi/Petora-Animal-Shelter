const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const animalProfileController = require('./animal_profile_controller');

const router = express.Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads/');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const safeName = file.originalname.replace(/\s+/g, '_');
        cb(null, safeName);
    }
});
const upload = multer({ storage });

router.get('/', animalProfileController.getAllAnimalProfiles);
router.post('/', upload.array('images', 5), animalProfileController.createAnimalProfile);
router.put('/:animalId', upload.array('images', 5), animalProfileController.updateAnimalProfile);
router.delete('/:animalId', animalProfileController.deleteAnimalProfile);

module.exports = router;