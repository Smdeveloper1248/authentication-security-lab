const express = require('express');
const db = require('../../db/db');

const router = express.Router();

router.post('/signup', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  // Intentionally insecure: this stores the password exactly as submitted.
  db.run(
    'INSERT INTO users (email, password) VALUES (?, ?)',
    [email, password],
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

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error.' });
    }

    // Intentionally insecure: passwords are stored and compared as plain text.
    if (!user || user.password !== password) {
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

module.exports = router;
