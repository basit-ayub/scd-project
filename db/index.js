const recordUtils = require('./record');
const vaultEvents = require('../events');
const fs = require('fs');
const { updateLastModified , getLastModified } = require('../data/meta');
const Record = require('./recordModel'); // Mongoose model

async function createBackup() {
  const data = await listRecords();
  if (!fs.existsSync("backups")) fs.mkdirSync("backups");

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  fs.writeFileSync(`backups/backup_${timestamp}.json`, JSON.stringify(data, null, 2));

  console.log("📝 Backup created successfully!");
}

async function addRecord({ name, value }) {
  recordUtils.validateRecord({ name, value });
  const createdAt = new Date();
  const newRecord = {
    id: recordUtils.generateId(),
    name,
    value,
    createdAt
  };

  const savedRecord = await Record.create(newRecord);
  vaultEvents.emit('recordAdded', savedRecord);
  await createBackup();
  updateLastModified();
  return savedRecord;
}

async function listRecords() {
  return await Record.find().sort({ createdAt: -1 }).lean();
}

async function updateRecord(id, newName, newValue) {
  const updated = await Record.findOneAndUpdate(
    { id },
    { name: newName, value: newValue },
    { new: true }
  ).lean();

  if (!updated) return null;
  vaultEvents.emit('recordUpdated', updated);
  updateLastModified();
  return updated;
}

async function deleteRecord(id) {
  const deleted = await Record.findOneAndDelete({ id }).lean();
  if (!deleted) return null;
  vaultEvents.emit('recordDeleted', deleted);
  await createBackup();
  updateLastModified();
  return deleted;
}

async function searchRecords(keyword) {
  keyword = keyword.trim(); // remove extra spaces
  const conditions = [
    { name: { $regex: keyword, $options: 'i' } }
  ];

  if (!isNaN(Number(keyword))) {
    conditions.push({ id: keyword }); 
  }

  const results = await Record.find({ $or: conditions }).lean();

  return results;
}


async function sortRecords(field, order) {
  const data = await listRecords();
  const sorted = [...data];

  const validFields = ["name", "date"];
  const validOrders = ["asc", "desc"];

  if (!validFields.includes(field)) {
    console.error(`Invalid sort field: "${field}". Use "name" or "date".\nReturning Unsorted Data.`);
    return data;
  }
  if (!validOrders.includes(order)) {
    console.warn(`Invalid sort order: "${order}". Defaulting to "asc".`);
    order = "asc";
  }

  sorted.sort((a, b) => {
    if (field === "name") {
      return order === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }

    if (field === "date") {
      return order === "asc"
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  return sorted;
}

async function exportData() {
  const data = await listRecords();
  const now = new Date();

  let text = `Exported On: ${now}\nTotal Records: ${data.length}\nFile: export.txt\n\nRecords:\n`;
  data.forEach(r => {
    text += `ID: ${r.id}, Name: ${r.name}, Value: ${r.value}, Created: ${r.createdAt}\n`;
  });

  fs.writeFileSync("export.txt", text);
}

async function getStats() {
  const data = await listRecords();
  if (data.length === 0) return "No records.";

  const total = data.length;
  const longestName = data.reduce((a, b) => a.name.length > b.name.length ? a : b);
  const dates = data.map(r => new Date(r.createdAt));
  const earliest = new Date(Math.min(...dates));
  const latest = new Date(Math.max(...dates));
  const lastModified = getLastModified();

  return {
    total,
    lastModified,
    longestName: `${longestName.name} (${longestName.name.length} chars)`,
    earliest,
    latest
  };
}

module.exports = { addRecord, listRecords, updateRecord, deleteRecord, searchRecords, sortRecords, exportData, getStats };
