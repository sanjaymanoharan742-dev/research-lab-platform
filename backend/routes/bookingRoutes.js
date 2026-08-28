const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// CREATE booking (with conflict check)
router.post('/', async (req, res) => {
  try {
    const { equipment, startTime, endTime } = req.body;

    const conflict = await Booking.findOne({
      equipment,
      status: { $ne: 'rejected' },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (conflict) {
      return res.status(409).json({ error: 'This equipment is already booked for the selected time.' });
    }

    const booking = new Booking(req.body);
    const saved = await booking.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET all bookings (with equipment details populated)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('equipment');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE booking status (approve/reject)
router.put('/:id', async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE booking
router.delete('/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// UTILIZATION SUMMARY - count bookings per equipment
router.get('/utilization/summary', async (req, res) => {
  try {
    const summary = await Booking.aggregate([
      {
        $group: {
          _id: '$equipment',
          totalBookings: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'equipment',
          localField: '_id',
          foreignField: '_id',
          as: 'equipmentDetails'
        }
      },
      { $unwind: '$equipmentDetails' },
      {
        $project: {
          _id: 0,
          equipmentName: '$equipmentDetails.name',
          totalBookings: 1
        }
      }
    ]);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;