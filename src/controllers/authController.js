const bcrypt = require('bcrypt');
const db = require('../../db/db');

const SALT_ROUNDS = 12;
const DUMMY_PASSWORD_HASH = '$2b$12$2fDGc40/IvDcfXdKQobPjOhw64H4bVuKKSCZEZKjZFIcMYKHn6Due';

function signup(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  return bcrypt.hash(password, SALT_ROUNDS, (hashErr, passwordHash) => {
    if (hashErr) {
      return res.status(500).json({ error: 'Failed to secure password.' });
    }

    return db.run(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, passwordHash],
      function onInsert(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Email is already registered.' });
          }

          return res.status(500).json({ error: 'Database error.' });
        }

        return res.status(201).json({
          message: 'Signup successful.',
          user: {
            id: this.lastID,
            email,
          },
        });
      }
    );
  });
}

function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  return db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error.' });
    }

    const passwordHash = user ? user.password : DUMMY_PASSWORD_HASH;

    return bcrypt.compare(password, passwordHash, (compareErr, isMatch) => {
      if (compareErr) {
        return res.status(500).json({ error: 'Failed to verify password.' });
      }

      if (!user || !isMatch) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      return res.json({
        message: 'Login successful.',
        user: {
          id: user.id,
          email: user.email,
        },
      });
    });
  });
}

module.exports = {
  login,
  signup,
};
