const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
});


const authController = require('../controllers/authController');
router.get('/logout', authController.logout);



router.post('/login', async (req, res) => {
  const { username, password, rememberMe } = req.body;

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Usuario/contraseña no encontrada. Intente de nuevo.' });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Usuario/contraseña no encontrada. Intente de nuevo.' });
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    const sessionToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: rememberMe ? '7d' : '1d',
    });

    res.cookie('sessionToken', sessionToken, { httpOnly: true, maxAge: rememberMe ? 604800000 : 86400000 });

    res.json({ message: 'Autenticación exitosa', user: req.session.user });
  } catch (error) {
    console.error('Error en la autenticación:', error);
    res.status(500).json({ message: 'Ha habido un error. Intente de nuevo.' });
  }
});

module.exports = router;