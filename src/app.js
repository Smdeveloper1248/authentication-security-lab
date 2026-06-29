const express = require('express');
const path = require('path');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
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
