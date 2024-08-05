// E'to son los módulos que requerimos pa' las rutas que to' el mundo puede ver (solamente es Express again).
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
let cart = [];


const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
});

// Ruta de la main page, woo-hoo!
router.get("/", (req, res, next) => {
  res.render("public/index", {
    layout: "main", 
    title: "Inicio",
    user: req.session ? req.session.user : null,
  });
});

// Ruta de la tienda
router.get('/tienda', (req, res) => {
  pool.query('SELECT * FROM productos', (error, results) => {
    if (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).send('Error interno del servidor');
    } else {
      res.render('public/tienda', {
        layout: 'tiendaMain',
        title: 'Tienda PUCMM',
        productos: results.rows
      });
    }
  });
});

// Ruta del carrito
router.get('/carrito', (req, res) => {
  res.render('public/carrito', {
    layout: 'tiendaMain',
    title: 'Mi Carrito',
    cart: cart
  });
});

router.get('/compra-exitosa', (req, res) => {
  const nombre = req.query.nombre || 'Cliente';
  res.render('public/compraExitosa', { nombre,
    layout: 'main',
    title: 'Tienda Pucmm'
   });
});

module.exports = router;