const mongoose = require('mongoose');

const StaffShiftSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    room: { type: String, default: '', trim: true },
    day: { type: String, default: 'Monday', trim: true },
    time: { type: String, default: '', trim: true },
    status: { type: String, default: 'Confirmed', enum: ['Confirmed', 'Pending', 'Cancelled'] },
    notes: { type: String, default: '', trim: true },
    photoUrl: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DaycareStaffShift', StaffShiftSchema);
