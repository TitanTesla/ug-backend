const Product = require('../models/product');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'client/images/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const addProduct = async (req, res) => {
  try {
    const { name, price, quantity, category } = req.body;
    const imagePath = req.file ? `./uploads/${req.file.filename}` : '';

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

module.exports = {
  addProduct,
  getProducts,
  upload
};
