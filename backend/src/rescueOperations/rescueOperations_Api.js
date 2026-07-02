// api/rescue_teams_api.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const rescueTeamControl = require('./rescueOperations_controller');


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


router.get('/:rescueOpID', rescueTeamControl.getRescueOpById);
router.get('/', rescueTeamControl.getAllOps);
router.post('/', upload.array('images', 5), rescueTeamControl.addRescueOp);
router.put('/:rescueOpID', upload.array('images', 5), rescueTeamControl.updateRescueOp);
router.delete('/:rescueOpID', rescueTeamControl.deleteOps);
router.get('/stats/species', rescueTeamControl.getSpeciesStats);

module.exports = router;
