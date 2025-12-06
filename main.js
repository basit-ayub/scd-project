const readline = require('readline');
const db = require('./db');
require('./events/logger'); // Initialize event logger
const connectDB = require('./db/mongo');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Connect to MongoDB


function askQuestion(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

async function menu() {
  console.log(`
===== NodeVault =====
1. Add Record
2. List Records
3. Update Record
4. Delete Record
5. Search Record
6. Sort Records     
7. Export Data 
8. View Vault Statistics
9. Exit
=====================
  `);

  const ans = await askQuestion('Choose option: ');

  switch (ans.trim()) {
    case '1': {
      const name = await askQuestion('Enter name: ');
      const value = await askQuestion('Enter value: ');
      const record = await db.addRecord({ name, value });
      console.log('✅ Record added successfully!');
      break;
    }

    case '2': {
      const records = await db.listRecords();
      if (records.length === 0) console.log('No records found.');
      else records.forEach(r => console.log(`ID: ${r.id} | Name: ${r.name} | Value: ${r.value} | Created: ${r.createdAt}`));
      break;
    }

    case '3': {
      const id = await askQuestion('Enter record ID to update: ');
      const name = await askQuestion('New name: ');
      const value = await askQuestion('New value: ');
      const updated = await db.updateRecord(Number(id), name, value);
      console.log(updated ? '✅ Record updated!' : '❌ Record not found.');
      break;
    }

    case '4': {
      const id = await askQuestion('Enter record ID to delete: ');
      const deleted = await db.deleteRecord(Number(id));
      console.log(deleted ? '🗑️ Record deleted!' : '❌ Record not found.');
      break;
    }

    case '5': {
      const keyword = await askQuestion('Enter search keyword: ');
      const results = await db.searchRecords(keyword);
      if (results.length === 0) console.log('No matching records found.');
      else {
        console.log(`Found ${results.length} matching record(s):`);
        results.forEach(r => console.log(`ID: ${r.id} | Name: ${r.name} | Value: ${r.value} | Created: ${r.createdAt}`));
      }
      break;
    }

    case '6': {
      const field = await askQuestion("Sort by (name/date): ");
      const order = await askQuestion("Order (asc/desc): ");
      const results = await db.sortRecords(field, order);
      console.log("Sorted Records:");
      results.forEach(r => console.log(`ID: ${r.id} | Name: ${r.name} | Created: ${r.createdAt}`));
      break;
    }

    case '7': {
      await db.exportData();
      console.log("Data exported successfully to export.txt");
      break;
    }

    case '8': {
      const stats = await db.getStats();
      console.log(`
Vault Statistics:
--------------------------
Total Records: ${stats.total}
Last Modified: ${stats.lastModified}
Longest Name: ${stats.longestName}
Earliest Record: ${stats.earliest}
Latest Record: ${stats.latest}
      `);
      break;
    }

    case '9':
      console.log('👋 Exiting NodeVault...');
      rl.close();
      process.exit(0);
      break;

    default:
      console.log('Invalid option.');
  }

  menu(); // loop menu
}

async function startCLI() {
  await connectDB();
  menu(); 
}

startCLI();
