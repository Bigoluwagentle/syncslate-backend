const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // real content (shapes/text) comes in Step 4 — for now, boards are just named containers
}, { timestamps: true });

module.exports = mongoose.model('Board', boardSchema);