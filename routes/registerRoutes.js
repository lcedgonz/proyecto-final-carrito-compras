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

router.post('/', async (req, res) => {
  const { username, password, rememberMe } = req.body;

  try {

    const existingUser = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: 'El nombre de usuario ya existe. Por favor, elija otro. Sea original, mi hermano, que usted puede.',
      });
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    const result = await pool.query(
      'INSERT INTO usuarios (username, password, role, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *',
      [username, hashedPassword, 'user']
    );

    const newUser = result.rows[0];


    const sessionToken = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: rememberMe ? '7d' : '1d',
    });


    res.cookie('sessionToken', sessionToken, { httpOnly: true, maxAge: rememberMe ? 604800000 : 86400000 });


    req.session.user = {
      id: newUser.id,
      username: newUser.username,
      role: newUser.role,
    };


    return res.json({ message: '¡Tu registro ha sido exitoso! Redirigiendo...', user: req.session.user });
  } catch (error) {
    console.error('Error en el registro:', error);


    if (error.code === '23505' && error.constraint === 'unique_username') {
      return res.status(400).json({
        message: 'El nombre de usuario ya existe. Por favor, elija otro. Sea original, mi hermano, que usted puede.',
      });
    }


    return res.status(500).json({ message: 'Ha habido un error en el registro. Intente de nuevo.' });
  }
});

module.exports = router;
