// File: routes/products.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  updateProductWithImage
} = require('../controllers/products');

// === IMAGE STORAGE ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // for Render
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// === ROUTES ===
router.post('/', upload.single('image'), addProduct);
router.get('/', getProducts);
router.delete('/', deleteProduct);
router.put('/', updateProduct); // For quantity/price via JSON
router.put('/update', upload.single('image'), updateProductWithImage); // For image update

module.exports = router;
