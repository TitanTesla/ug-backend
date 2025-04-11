const Product = require('../models/product');
const multer = require('multer');
const path = require('path');

// === Image Upload Config ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './server/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// === ADD Product ===
const addProduct = async (req, res) => {
  try {
    const { name, price, quantity, category } = req.body;
    const imagePath = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : '';

    const product = new Product({ name, price, quantity, category, image: imagePath });
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// === GET All Products ===
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// === DELETE Product ===
const deleteProduct = async (req, res) => {
  const { name, category } = req.query;
  try {
    const deleted = await Product.findOneAndDelete({ name, category });
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted', deleted });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};

// === UPDATE Product (quantity and/or price only) ===
const updateProduct = async (req, res) => {
  const { name, category } = req.query;
  const { quantity, price } = req.body;

  try {
    if (!name || !category || (quantity == null && price == null)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const updates = {};
    if (quantity != null) updates.quantity = quantity;
    if (price != null) updates.price = price;

    const updated = await Product.findOneAndUpdate(
      { name, category },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};

// === UPDATE with Image (FormData: price, qty, image) ===
const updateProductWithImage = async (req, res) => {
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
      { new: true, runValidators: true, context: 'query' }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating product with image:', error);
    res.status(500).json({ message: 'Error updating product', error });
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
   
