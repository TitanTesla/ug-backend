const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/product');

// === Multer Config ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './server/uploads'); // Make sure this path exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g., 16829232.png
  }
});
const upload = multer({ storage });

/* ========== ROUTES ========== */

// === CREATE: Add new product with image ===
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, price, quantity, category } = req.body;
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const newProduct = new Product({
      name,
      price,
      quantity,
      category,
      image: imageUrl,
    });

    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// === READ: Get all products ===
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// === DELETE: By name + category ===
router.delete('/', async (req, res) => {
  const { name, category } = req.query;
  try {
    const deleted = await Product.findOneAndDelete({ name, category });
    if (!deleted) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({ message: 'Product deleted', deleted });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
});

// === UPDATE: Quantity/Price (only via JSON) ===
router.put('/', async (req, res) => {
  const { name, category } = req.query;
  const { quantity, price } = req.body;

  try {
    if (!name || !category || (quantity == null && price == null)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const updateFields = {};
    if (quantity != null) updateFields.quantity = quantity;
    if (price != null) updateFields.price = price;

    const updated = await Product.findOneAndUpdate(
      { name, category },
      { $set: updateFields },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({ message: 'Product updated', updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
});

// === UPDATE with IMAGE: Price/Quantity/Image (via FormData) ===
router.put('/update', upload.single('image'), async (req, res) => {
  const { name, category } = req.body;

  if (!name || !category) {
    return res.status(400).json({ message: 'Product name and category are required' });
  }

  const updates = {};

  if (req.body.price) updates.price = req.body.price;
  if (req.body.quantity) updates.quantity = req.body.quantity;
  if (req.file) {
    updates.image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  }

  try {
    const updated = await Product.findOneAndUpdate(
      { name, category },
      { $set: updates },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating product with image:', error);
    res.status(500).json({ message: 'Error updating product', error });
  }
});

module.exports = router;
