// api/rescue_teams_api.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const rescueTeamControl = require('./rescue_team_contoller');


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


router.get('/:rescueTeamID', rescueTeamControl.getRescueTeamById);
router.get('/', rescueTeamControl.getAllTeams);
router.post('/', upload.single('teamLogo'), rescueTeamControl.addRescueTeam);
router.put('/:rescueTeamID', upload.single('teamLogo'), rescueTeamControl.updateRescueTeam);
router.delete('/:rescueTeamID', rescueTeamControl.deleteRescueTeam);

module.exports = router;
