const DaycareStaffShift = require('./daycare_staff_scheduling_model');

// GET /daycare_staff_scheduling/api/staff_shifts
exports.getAll = async (req, res) => {
  try {
    const items = await DaycareStaffShift.find().sort({ createdAt: 1 });
    res.json(items);
  } catch (err) {
    console.error('Error fetching staff shifts:', err);
    res.status(500).json({ error: 'Failed to fetch staff shifts' });
  }
};

// POST /daycare_staff_scheduling/api/staff_shifts
exports.create = async (req, res) => {
  try {
    const { name, role, room, day, time, status, notes, photoUrl } = req.body;
    if (!name || !role) return res.status(400).json({ error: 'name and role are required' });
    const created = await DaycareStaffShift.create({ name, role, room, day, time, status, notes, photoUrl });
    res.status(201).json(created);
  } catch (err) {
    console.error('Error creating staff shift:', err);
    res.status(500).json({ error: 'Failed to create staff shift' });
  }
};

// PUT /daycare_staff_scheduling/api/staff_shifts/:id
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, room, day, time, status, notes, photoUrl } = req.body;
    const updated = await DaycareStaffShift.findByIdAndUpdate(
      id,
      { name, role, room, day, time, status, notes, photoUrl },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Staff shift not found' });
    res.json(updated);
  } catch (err) {
    console.error('Error updating staff shift:', err);
    res.status(500).json({ error: 'Failed to update staff shift' });
  }
};

// DELETE /daycare_staff_scheduling/api/staff_shifts/:id
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DaycareStaffShift.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Staff shift not found' });
    res.json({ success: true, id });
  } catch (err) {
    console.error('Error deleting staff shift:', err);
    res.status(500).json({ error: 'Failed to delete staff shift' });
  }
};
