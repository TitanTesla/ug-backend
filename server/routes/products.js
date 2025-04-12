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

// === CREATE: Add product with image ===
router.post('/', upload.single('image'), addProduct);

// === READ: Get all products ===
router.get('/', getProducts);

// === DELETE: By name and category ===
router.delete('/', deleteProduct);

// === UPDATE (Price/Quantity only via JSON) ===
router.put('/', updateProduct);

// === UPDATE with Image (via FormData) ===
router.put('/update', upload.single('image'), updateProductWithImage);

module.exports = router;
