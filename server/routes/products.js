const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/product');

// Image storage config (flat structure)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './server/uploads'); // Save in client/images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique name
  }
});
const upload = multer({ storage });

// CREATE: Add product with image
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

// READ: Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE: By name and category
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

// UPDATE: Quantity and/or price by name + category
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

module.exports = router;
