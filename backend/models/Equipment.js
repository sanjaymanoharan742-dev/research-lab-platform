const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'offline'],
    default: 'active'
  },
  location: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Equipment', equipmentSchema);