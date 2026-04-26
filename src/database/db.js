const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '../../data');

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(path.join(dataDir, 'threatradar.db'));

//creating scans table if it doesnt exist

db.exec(`
        CREATE TABLE IF NOT EXISTS scans(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            target TEXT NOT NULL,
            type TEXT NOT NULL,
            finalScore INTEGER,
            threatLevel TEXT,
            fullReport TEXT,
            scannedAt TEXT NOT NULL
        )
    `)

console.log('Database Initialised')

module.exports= db
