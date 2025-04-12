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

// Create product with image
router.post('/', upload.single('image'), addProduct);

// Get all products
router.get('/', getProducts);

// Delete by name & category
router.delete('/', deleteProduct);

// Update quantity/price only
router.put('/', updateProduct);

// Update with image (FormData support)
router.put('/update', upload.single('image'), updateProductWithImage);

module.exports = router;
