const express = require('express');
const router = express.Router();
const { registro, login, logout } = require('../controllers/authController');

// Ruta de registro
router.post('/registro', registro);

// Ruta de login
router.post('/login', login);

// Ruta de logout
router.post('/logout', logout);

// Ruta para obtener token CSRF
router.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.session.csrfToken, sessionId: req.sessionID });
});

module.exports = router;