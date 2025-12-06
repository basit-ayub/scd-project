const Record = require('./recordModel');

// List all records
async function listRecords() {
  return await Record.find().sort({ createdAt: -1 }).lean();
}

// Add a record
async function addRecord({ id, name, value, createdAt }) {
  const record = new Record({ id, name, value, createdAt });
  return await record.save();
}

// Update a record
async function updateRecord(id, newName, newValue) {
  return await Record.findOneAndUpdate(
    { id },
    { name: newName, value: newValue },
    { new: true }
  );
}

// Delete a record
async function deleteRecord(id) {
  return await Record.findOneAndDelete({ id });
}

// Search
async function searchRecords(keyword) {
  keyword = keyword.toLowerCase();
  return await Record.find({
    $or: [
      { name: { $regex: keyword, $options: 'i' } },
      { id: Number(keyword) }
    ]
  }).lean();
}

module.exports = { listRecords, addRecord, updateRecord, deleteRecord, searchRecords };
