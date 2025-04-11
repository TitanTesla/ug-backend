const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be a positive number']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Men', 'Women', 'Unisex'],
      message: 'Category must be Men, Women, or Unisex'
    },
    lowercase: true,
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Product image is required']
  }
}, {
  timestamps: true // adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Product', productSchema);

