const Product = require('../models/product');
const path = require('path');

// === ADD PRODUCT ===
const addProduct = async (req, res) => {
  try {
    const { name, price, quantity, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    const product = new Product({ name, price, quantity, category, image });
    await product.save();

    res.status(201).json(product);
  } catch (err) {
    console.error('Add product error:', err);
    res.status(500).json({ message: 'Failed to add product' });
  }
};

// === GET ALL PRODUCTS ===
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// === DELETE PRODUCT ===
const deleteProduct = async (req, res) => {
  const { name, category } = req.query;
  try {
    const deleted = await Product.findOneAndDelete({ name, category });
    if (!deleted) return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Product deleted', deleted });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
};

// === UPDATE PRODUCT (JSON: qty/price only) ===
const updateProduct = async (req, res) => {
  const { name, category } = req.query;
  const { quantity, price } = req.body;

  if (!name || !category || (!quantity && !price)) {
    return res.status(400).json({ message: 'Missing update fields' });
  }

  try {
    const updateFields = {};
    if (quantity !== undefined) updateFields.quantity = quantity;
    if (price !== undefined) updateFields.price = price;

    const updated = await Product.findOneAndUpdate(
      { name, category },
      { $set: updateFields },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated', updated });
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};

// === UPDATE PRODUCT WITH IMAGE (FormData) ===
const updateProductWithImage = async (req, res) => {
  const { name, category } = req.body;
  const { quantity, price } = req.body;

  if (!name || !category || (!quantity && !price && !req.file)) {
    return res.status(400).json({ message: 'Missing update fields' });
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
    res.json({ message: 'Product updated with image', updated });
  } catch (err) {
    console.error('Update with image error:', err);
    res.status(500).json({ message: 'Update failed' });
  }
};

module.exports = {
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  updateProductWithImage
};
