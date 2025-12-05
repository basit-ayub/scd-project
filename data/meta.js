const fs = require('fs');
const path = require('path');

const metaPath = path.join(__dirname, 'meta.json');

function initMeta() {
  if (!fs.existsSync(metaPath)) {
    fs.writeFileSync(metaPath, JSON.stringify({ lastModified: null }, null, 2));
  }
}

function updateLastModified() {
  const meta = { lastModified: new Date().toISOString() };
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
}

function getLastModified() {
  initMeta();
  return JSON.parse(fs.readFileSync(metaPath)).lastModified;
}

module.exports = { updateLastModified, getLastModified };
