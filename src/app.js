const express = require('express');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Authentication Security Lab',
    demoUser: {
      email: 'student@example.test',
      password: 'password123',
    },
  });
});

app.use('/api/auth', authRoutes);

if (require.main === module) {
  app.listen(PORT, (err) => {
    if (err) {
      console.error('Failed to start authentication security lab:', err.message);
      process.exit(1);
    }

    console.log(`Authentication security lab running on http://localhost:${PORT}`);
  });
}

module.exports = app;
