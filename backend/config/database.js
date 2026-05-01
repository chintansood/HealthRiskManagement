const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '../health_system.db'));

db.serialize(() => {
  // Enable foreign key enforcement
  db.run('PRAGMA foreign_keys = ON');

  db.run(`CREATE TABLE IF NOT EXISTS patient (
    patient_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    contact TEXT NOT NULL,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS health_metrics (
    metric_id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    bp_systolic REAL,
    bp_diastolic REAL,
    sugar_level REAL,
    bmi REAL,
    date_record DATE DEFAULT (DATE('now')),
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS risk_score (
    risk_id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    score REAL,
    risk_level TEXT,
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS alerts (
    alert_id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    alert_message TEXT,
    alert_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
  )`);

  console.log('✅ SQLite DB Ready!');
});

// For INSERT / UPDATE / DELETE — captures lastID and changes
const run = (query, params = []) =>
  new Promise((resolve, reject) => {
    db.run(query, params, function (err) {   // regular function — this.lastID works
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });

// For SELECT — returns rows array
const query = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve({ rows });
    });
  });

// Backwards-compatible execute: auto-routes to run or query based on SQL verb
const execute = (sql, params = []) => {
  const verb = sql.trim().split(/\s+/)[0].toUpperCase();
  if (['INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER', 'PRAGMA'].includes(verb)) {
    return run(sql, params);
  }
  return query(sql, params);
};

module.exports = { execute, run, query };