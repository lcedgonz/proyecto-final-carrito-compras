const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const verifyToken = require('../middleware/authMiddleware');
const multer = require('multer');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/productos');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get('/api/productos/:id', verifyToken, productController.getProductById); 
router.get('/admin/productos', verifyToken, productController.getAllProducts);
router.post('/admin/productos', verifyToken, productController.createProduct);
router.post('/admin/productos/:id/edit', verifyToken, productController.editProduct);
router.post('/admin/productos/:id/delete', verifyToken, productController.deleteProduct);
router.post('/', verifyToken, upload.single('imageurl'), productController.createProduct);
router.post('/:id/edit', verifyToken, upload.single('imageurl'), productController.editProduct);
router.post('/admin/productos', verifyToken, upload.single('imageurl'), productController.createProduct);

module.exports = router;
