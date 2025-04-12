// File: controllers/products.js
const Product = require('../models/product');
const multer = require('multer');
const path = require('path');

// === Multer Storage Setup ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// === CREATE ===
const addProduct = async (req, res) => {
  try {
    const { name, price, quantity, category } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    const product = new Product({ name, price, quantity, category, image: imagePath });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// === READ ===
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// === DELETE ===
const deleteProduct = async (req, res) => {
  const { name, category } = req.query;
  try {
    const deleted = await Product.findOneAndDelete({ name, category });
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted', deleted });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};

// === UPDATE (without image) ===
const updateProduct = async (req, res) => {
  const { name, category } = req.query;
  const { quantity, price } = req.body;

  if (!name || !category || (quantity == null && price == null)) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
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
};

// === UPDATE with Image ===
const updateProductWithImage = async (req, res) => {
  const { name, category } = req.query;
  const { quantity, price } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name || !category || (!quantity && !price && !imagePath)) {
    return res.status(400).json({ message: 'Missing fields to update' });
  }

  try {
    const updateFields = {};
    if (quantity) updateFields.quantity = quantity;
    if (price) updateFields.price = price;
    if (imagePath) updateFields.image = imagePath;

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
};

module.exports = {
  upload,
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  updateProductWithImage
};
