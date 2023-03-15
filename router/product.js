const router = require('express').Router();
const multer = require('multer');
const os = require('os');
const productController = require('../controller/product');

// For show data all product
router.get('/product/', productController.viewPruduct);

// For show data all product by id
router.get(`/product/:id`, productController.getProductById)

// For show data and filter by name product
router.get('/product/search', productController.viewPruduct);

// For create data staff
router.post('/product',
    multer({ dest: os.tmpdir() }).single('image'),
    productController.createProduct);

// For Update data product
router.put('/product/:id',
    multer({ dest: os.tmpdir() }).single('image'),
    productController.updateProduct);

// For Delete data staff by list product
router.post('/product/:id', productController.deleteProduct);

module.exports = router;