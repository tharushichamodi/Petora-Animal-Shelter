const express = require('express');
const router = express.Router();
const ctrl = require('./daycare_staff_scheduling_controller');

// Base: /daycare_staff_scheduling/api/staff_shifts
router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
