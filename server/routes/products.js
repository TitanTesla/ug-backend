const express = require('express');
const router = express.Router();
const {
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  upload
} = require('../controllers/products');

// === CREATE ===
router.post('/', upload.single('image'), addProduct);

// === READ ===
router.get('/', getProducts);

// === DELETE ===
router.delete('/', deleteProduct);

// === UPDATE (supports optional image upload) ===
router.put('/', upload.single('image'), updateProduct);

module.exports = router;
