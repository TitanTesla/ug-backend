// File: routes/products.js
const express = require('express');
const router = express.Router();
const {
  upload,
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  updateProductWithImage
} = require('../controllers/products');

router.post('/', upload.single('image'), addProduct);
router.get('/', getProducts);
router.delete('/', deleteProduct);
router.put('/', updateProduct); // JSON update
router.put('/update', upload.single('image'), updateProductWithImage); // FormData update

module.exports = router;
