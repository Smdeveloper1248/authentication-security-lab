const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'auth-lab.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);

  db.all('PRAGMA table_info(users)', (err, columns) => {
    if (err) {
      console.error('Failed to inspect users table:', err.message);
      return;
    }

    const hasEmail = columns.some((column) => column.name === 'email');
    const hasUsername = columns.some((column) => column.name === 'username');

    if (!hasEmail && hasUsername) {
      db.serialize(() => {
        db.run(`
          CREATE TABLE users_email_migration (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
          )
        `);
        db.run(`
          INSERT OR IGNORE INTO users_email_migration (id, email, password)
          SELECT id, username || '@example.test', password FROM users
        `);
        db.run('DROP TABLE users');
        db.run('ALTER TABLE users_email_migration RENAME TO users');
        db.run(
          'INSERT OR IGNORE INTO users (email, password) VALUES (?, ?)',
          ['student@example.test', 'password123']
        );
      });
      return;
    }

    // Intentionally insecure seed account for the authentication security lab.
    db.run(
      'INSERT OR IGNORE INTO users (email, password) VALUES (?, ?)',
      ['student@example.test', 'password123']
    );
  });
});

module.exports = db;
