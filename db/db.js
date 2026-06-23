const path = require('path');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'auth-lab.sqlite');
const db = new sqlite3.Database(dbPath);
const SALT_ROUNDS = 12;
const DEMO_PASSWORD = 'password123';

function isBcryptHash(value) {
  return typeof value === 'string' && /^\$2[aby]\$\d{2}\$/.test(value);
}

function hashPlainTextPasswords() {
  db.all('SELECT id, password FROM users', (err, users) => {
    if (err) {
      console.error('Failed to inspect user passwords:', err.message);
      return;
    }

    users
      .filter((user) => !isBcryptHash(user.password))
      .forEach((user) => {
        const passwordHash = bcrypt.hashSync(user.password, SALT_ROUNDS);
        db.run('UPDATE users SET password = ? WHERE id = ?', [passwordHash, user.id]);
      });
  });
}

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
          ['student@example.test', bcrypt.hashSync(DEMO_PASSWORD, SALT_ROUNDS)],
          hashPlainTextPasswords
        );
      });
      return;
    }

    db.run(
      'INSERT OR IGNORE INTO users (email, password) VALUES (?, ?)',
      ['student@example.test', bcrypt.hashSync(DEMO_PASSWORD, SALT_ROUNDS)],
      hashPlainTextPasswords
    );
  });
});

module.exports = db;
