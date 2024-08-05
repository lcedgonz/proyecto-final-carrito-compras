const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});


exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).json({ message: "Error al obtener el producto." });
  }
};



exports.createProduct = async (req, res) => {
  try {
    const { nombre, precio, cantidad, descripcion } = req.body;
    const imageurl = req.file ? req.file.filename : null; 
    await pool.query(
      'INSERT INTO productos (nombre, precio, cantidad, descripcion, imageurl) VALUES ($1, $2, $3, $4, $5)',
      [nombre, precio, cantidad, descripcion, imageurl]
    );
    res.redirect('/admin/productos');
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).send('Error al crear el producto');
  }
};

exports.editProduct = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, cantidad, descripcion } = req.body;
  const imageurl = req.file ? req.file.filename : null;

  try {
    const query = imageurl
      ? 'UPDATE productos SET nombre = $1, precio = $2, cantidad = $3, descripcion = $4, imageurl = $5 WHERE id = $6'
      : 'UPDATE productos SET nombre = $1, precio = $2, cantidad = $3, descripcion = $4 WHERE id = $5';

    const params = imageurl
      ? [nombre, precio, cantidad, descripcion, imageurl, id]
      : [nombre, precio, cantidad, descripcion, id];

    await pool.query(query, params);
    res.redirect('/admin/productos');
  } catch (error) {
    console.error('Error editando el producto:', error);
    res.status(500).send('Error editando el producto');
  }
};


exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM productos WHERE id = $1', [id]);
    res.redirect('/admin/productos');
  } catch (error) {
    console.error('Error al borrar el producto:', error);
    res.status(500).send('Error al borrar producto.');
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos');
      res.render('admin/products', { 
      layout: 'adminMain', 
      title: 'Administrar Productos', 
      productos: result.rows 
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).send('Error al obtener productos');
  }
};