const express = require('express');
const rescueMemberController = require('./rescue_member_controller');

const router = express.Router();

// Get all rescue members
router.get('/', rescueMemberController.getAllRescueMembers);

// Create a new rescue member
router.post('/', rescueMemberController.addRescueMember);

// Update a rescue member
router.put('/:rescuerID', rescueMemberController.updateRescueMember);

// Delete a rescue member
router.delete('/:rescuerID', rescueMemberController.deleteRescueMember);

module.exports = router;