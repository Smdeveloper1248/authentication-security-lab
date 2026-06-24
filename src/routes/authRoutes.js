const express = require('express');
const { login, signup } = require('../controllers/authController');

const router = express.Router();

// Route: POST /api/auth/signup
router.post('/signup', signup);

// Route: POST /api/auth/login
router.post('/login', login);

module.exports = router;
