// E'to son los módulos que requerimos pa' las rutas de un usuario chusma (común, no admin).
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');


router.get('/dashboard', verifyToken, userController.userDashboard);
router.get('/profile', verifyToken, userController.userProfile);


module.exports = router;