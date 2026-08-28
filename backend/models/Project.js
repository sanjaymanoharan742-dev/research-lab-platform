const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  principalInvestigator: {
    type: String,
    required: true
  },
  members: [
    {
      type: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);