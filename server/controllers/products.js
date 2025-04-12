const Product = require('../models/product');
const multer = require('multer');
const path = require('path');

// === MULTER CONFIG ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // For Render backend
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// === CREATE PRODUCT ===
const addProduct = async (req, res) => {
  try {
    const { name, price, quantity, category } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    const product = new Product({
      name,
      price,
      quantity,
      category,
      image: imagePath
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// === GET ALL PRODUCTS ===
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// === DELETE PRODUCT ===
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

// === UPDATE PRODUCT (with or without image) ===
const updateProduct = async (req, res) => {
  const { name, category } = req.query;
  const { quantity, price } = req.body;

  if (!name || !category) {
    return res.status(400).json({ message: 'Product name and category are required' });
  }

  const updateFields = {};
  if (quantity) updateFields.quantity = quantity;
  if (price) updateFields.price = price;
  if (req.file) updateFields.image = `/uploads/${req.file.filename}`;

  try {
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
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  upload
};
