const Product = require('../models/product');
const multer = require('multer');
const path = require('path');

// Set image upload path to uploads/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

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

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const { name, category } = req.query;
  try {
    const deleted = await Product.findOneAndDelete({ name, category });
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Deleted successfully', deleted });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', err });
  }
};

const updateProduct = async (req, res) => {
  const { name, category } = req.query;
  const { price, quantity } = req.body;

  if (!name || !category) {
    return res.status(400).json({ message: 'Product name and category are required' });
  }

  const updateFields = {};
  if (price != null) updateFields.price = price;
  if (quantity != null) updateFields.quantity = quantity;

  try {
    const updated = await Product.findOneAndUpdate(
      { name, category },
      { $set: updateFields },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated', updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating product', err });
  }
};

// ✅ NEW: Update with image (multipart/form-data)
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
    res.status(500).json({ message: 'Error updating product', err });
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
