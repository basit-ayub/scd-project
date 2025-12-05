const fileDB = require('./file');
const recordUtils = require('./record');
const vaultEvents = require('../events');

function addRecord({ name, value }) {
  recordUtils.validateRecord({ name, value });
  const data = fileDB.readDB();
  const createdAt = new Date().toISOString().split('T')[0];
  const newRecord = { id: recordUtils.generateId(), name, value, createdAt };
  data.push(newRecord);
  fileDB.writeDB(data);
  vaultEvents.emit('recordAdded', newRecord);
  return newRecord;
}

function listRecords() {
  return fileDB.readDB();
}

function updateRecord(id, newName, newValue) {
  const data = fileDB.readDB();
  const record = data.find(r => r.id === id);
  if (!record) return null;
  record.name = newName;
  record.value = newValue;
  fileDB.writeDB(data);
  vaultEvents.emit('recordUpdated', record);
  return record;
}

function deleteRecord(id) {
  let data = fileDB.readDB();
  const record = data.find(r => r.id === id);
  if (!record) return null;
  data = data.filter(r => r.id !== id);
  fileDB.writeDB(data);
  vaultEvents.emit('recordDeleted', record);
  return record;
}
function searchRecords(keyword) {
  keyword = keyword.toLowerCase();
  const data = this.listRecords();
  return data.filter(r =>
    r.name.toLowerCase().includes(keyword) ||
    r.id.toString() === keyword
  );
}

function sortRecords(field, order) {
  const data = this.listRecords();
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

module.exports = { addRecord, listRecords, updateRecord, deleteRecord , searchRecords, sortRecords};
