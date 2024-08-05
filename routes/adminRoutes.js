// E'to son los módulos que requerimos pa' las rutas del admin (solamente es Express, but yeah).
const express = require('express');
const router = express.Router();
const {
    adminDashboard,
    addTask,
    deleteTask,
    completeTask
} = require('../controllers/dashboardController');
const productController = require('../controllers/productController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/dashboard', verifyToken, adminDashboard);
router.post('/add-task', verifyToken, addTask);
router.post('/delete-task', verifyToken, deleteTask);
router.post('/complete-task', verifyToken, completeTask);


router.get('/productos', verifyToken, productController.getAllProducts);
router.post('/productos/crear', verifyToken, productController.createProduct);
router.post('/productos/editar/:id', verifyToken, productController.editProduct);
router.post('/productos/eliminar/:id', verifyToken, productController.deleteProduct);

module.exports = router;