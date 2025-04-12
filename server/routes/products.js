// server/routes/products.js

const express = require('express');
const router = express.Router();
const {
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  updateProductWithImage,
  upload
} = require('../controllers/products');

// === POST: Create Product (with image) ===
router.post('/', upload.single('image'), addProduct);

// === GET: All products ===
router.get('/', getProducts);

// === DELETE: Product by name and category ===
router.delete('/', deleteProduct);

// === PUT: Update price/quantity (JSON) ===
router.put('/', updateProduct);

// === PUT: Update product with image (FormData) ===
router.put('/update', upload.single('image'), updateProductWithImage);

module.exports = router;
