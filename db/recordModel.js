const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  value: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;
