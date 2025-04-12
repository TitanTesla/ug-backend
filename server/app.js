// File: app.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const productRoutes = require('./routes/products');
const salesRoutes = require('./routes/sales');
require('dotenv').config();

const app = express();

// === DATABASE CONNECTION ===
connectDB();

// === ALLOWED FRONTEND ORIGINS ===
const allowedOrigins = ['https://titantesla.github.io'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// === MIDDLEWARE ===
app.use(bodyParser.json());
app.use(express.static('client')); // for /images or static assets

// === ROUTES ===
app.use('/api/products', productRoutes);
app.use('/api', salesRoutes);

// === START SERVER ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
