const protect = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();
const Equipment = require('../models/Equipment');

// CREATE new equipment
router.post('/', protect, async (req, res) => {
  try {
    const equipment = new Equipment(req.body);
    const saved = await equipment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET all equipment
router.get('/', async (req, res) => {
  try {
    const equipmentList = await Equipment.find();
    res.json(equipmentList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// UPDATE equipment by ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Equipment not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE equipment by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Equipment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Equipment not found' });
    res.json({ message: 'Equipment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;