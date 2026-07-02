// api/review_api.js
const express = require('express');
const router = express.Router();

const empController = require('./employee_controller');


router.get('/', empController.getAllEmployees);
router.post('/', empController.addEmployee);
router.delete('/:userID', empController.deleteEmployeeById);

module.exports = router;
