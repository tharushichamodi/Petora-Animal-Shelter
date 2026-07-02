const RescueMember = require('./rescue_member_model.js');

// Get all rescue members
exports.getAllRescueMembers = async (req, res) => {
  try {
    const members = await RescueMember.find();
    if (!members || members.length === 0) return res.status(404).json({ error: 'No rescue member found' });
    res.json(members);
  } catch (error) {
    console.error('Error fetching rescue members:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add new rescue member
exports.addRescueMember = async (req, res) => {
  try {
    const newMember = new RescueMember(req.body); // Assumes req.body has all required fields
    const savedMember = await newMember.save();
    res.status(201).json(savedMember);
  } catch (error) {
    console.error('Error adding rescue member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update rescue member by rescuerID from req.body
exports.updateRescueMember = async (req, res) => {
  try {
    const { rescuerID, ...updateData } = req.body;
    if (!rescuerID) {
      return res.status(400).json({ error: 'rescuerID is required in request body' });
    }
    const updatedMember = await RescueMember.findOneAndUpdate(
      { rescuerID: rescuerID },
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedMember) return res.status(404).json({ error: 'Rescue member not found' });
    res.json({ message: 'Rescue member updated successfully', data: updatedMember });
  } catch (error) {
    console.error('Error updating rescue member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete rescue member by rescuerID from req.body
exports.deleteRescueMember = async (req, res) => {
  try {
    const { rescuerID } = req.body;
    if (!rescuerID) {
      return res.status(400).json({ error: 'rescuerID is required in request body' });
    }
    const deletedMember = await RescueMember.findOneAndDelete({ rescuerID: rescuerID });
    if (!deletedMember) return res.status(404).json({ error: 'Rescue member not found' });
    res.json({ message: 'Rescue member deleted successfully' });
  } catch (error) {
    console.error('Error deleting rescue member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};