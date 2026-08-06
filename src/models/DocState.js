const mongoose = require('mongoose');

const docStateSchema = new mongoose.Schema({
  documentName: { type: String, required: true, unique: true },
  state: { type: Buffer, required: true },
}, { timestamps: true });

module.exports = mongoose.model('DocState', docStateSchema);