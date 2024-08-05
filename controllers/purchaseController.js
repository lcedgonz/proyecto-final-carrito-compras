const pool = require('../database');

exports.registrarVenta = async (req, res) => {
    try {
        const { nombre } = req.body;
        const cart = JSON.parse(req.body.cart); 
        const total = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);


        const ventaResult = await pool.query(
            'INSERT INTO ventas (nombre_cliente, total) VALUES ($1, $2) RETURNING id',
            [nombre, total]
        );
        const ventaId = ventaResult.rows[0].id;


        const queries = cart.map(item => {
            return pool.query(
                'INSERT INTO ventas_productos (venta_id, producto_id, nombre_producto, cantidad, precio, subtotal) VALUES ($1, $2, $3, $4, $5, $6)',
                [ventaId, item.id, item.nombre, item.cantidad, item.precio, item.precio * item.cantidad]
            );
        });

        await Promise.all(queries);


        res.redirect(`/compra-exitosa?nombre=${encodeURIComponent(nombre)}`);
    } catch (error) {
        console.error('Error al registrar la venta:', error);
        res.status(500).send('Error al procesar la compra');
    }
};
