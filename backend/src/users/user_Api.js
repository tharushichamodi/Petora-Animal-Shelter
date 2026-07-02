// api/user_APi.js
const express = require('express');
const router = express.Router();

const userController = require('./user_controller');

router.get('/:id', userController.getUser);
router.get('/', userController.getAllUsers);
router.post('/', userController.addUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;