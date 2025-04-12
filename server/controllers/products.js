// controllers/products.js

const Product = require('../models/product');
const multer = require('multer');
const path = require('path');

// Configure Multer for uploads to /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'server/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// CREATE: Add product with image
const addProduct = async (req, res) => {
  try {
    const { name, price, quantity, category } = req.body;
    const imagePath = req.file ? `https://${req.headers.host}/uploads/${req.file.filename}` : '';

    const product = new Product({
      name,
      price,
      quantity,
      category,
      image: imagePath
    });

    const saved = await product.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ: Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE: Delete by name and category
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

// UPDATE: Only quantity and/or price (without image)
const updateProduct = async (req, res) => {
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
};

// UPDATE: With optional image (form-data)
const updateProductWithImage = async (req, res) => {
  const { name, category } = req.query;
  const { price, quantity } = req.body;

  if (!name || !category) {
    return res.status(400).json({ error: 'Product name and category are required.' });
  }

  try {
    const updateFields = {};
    if (price) updateFields.price = Number(price);
    if (quantity) updateFields.quantity = Number(quantity);
    if (req.file) {
      updateFields.image = `https://${req.headers.host}/uploads/${req.file.filename}`;
    }

    const updated = await Product.findOneAndUpdate(
      { name, category },
      { $set: updateFields },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', updated });
  } catch (err) {
    console.error('Update failed:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  updateProductWithImage,
  upload
};
