const fs = require('fs');
const path = require('path');
require('dotenv').config();
const connectDB = require('./mongo');
const Record = require('./recordModel');

async function importVault() {
  await connectDB();
  const dataPath = path.join(__dirname, '../data/vault.json');
  const records = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  for (const r of records) {
    const record = new Record({
      id: r.id,
      name: r.name,
      value: r.value,
      createdAt: r.createdAt ? new Date(r.createdAt) : new Date()
    });
    await record.save();
  }

  console.log(`Imported ${records.length} records.`);
  process.exit();
}

importVault();
