const Product = require('../models/product');
const multer = require('multer');
const path = require('path');

// === Image Upload Configuration ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // store in /uploads (matches Render setup)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique name
  }
});
const upload = multer({ storage });

// === Add Product with Image ===
const addProduct = async (req, res) => {
  try {
    const { name, price, quantity, category } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    const newProduct = new Product({
      name,
      price,
      quantity,
      category,
      image: imagePath
    });

    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// === Get All Products ===
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// === Delete Product by name + category ===
const deleteProduct = async (req, res) => {
  const { name, category } = req.query;
  try {
    const deleted = await Product.findOneAndDelete({ name, category });
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted', deleted });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', error: err.message });
  }
};

// === Update Product (price/qty only) ===
const updateProduct = async (req, res) => {
  const { name, category } = req.query;
  const { price, quantity } = req.body;

  if (!name || !category) {
    return res.status(400).json({ message: 'Product name and category are required' });
  }

  const updateFields = {};
  if (price !== undefined) updateFields.price = price;
  if (quantity !== undefined) updateFields.quantity = quantity;

  try {
    const updated = await Product.findOneAndUpdate(
      { name, category },
      { $set: updateFields },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated', updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating product', error: err.message });
  }
};

// === Update Product with Image (via FormData) ===
const updateProductWithImage = async (req, res) => {
  const { name, category } = req.query;

  if (!name || !category) {
    return res.status(400).json({ message: 'Product name and category are required' });
  }

  const updateFields = {};
  if (req.body.price) updateFields.price = req.body.price;
  if (req.body.quantity) updateFields.quantity = req.body.quantity;
  if (req.file) updateFields.image = `/uploads/${req.file.filename}`;

  try {
    const updated = await Product.findOneAndUpdate(
      { name, category },
      { $set: updateFields },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated with image', updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating product', error: err.message });
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
