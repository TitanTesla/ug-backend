// File: app.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const productRoutes = require('./routes/products');
const salesRoutes = require("./routes/sales");
require('dotenv').config();

const app = express();


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); // So /images works

// Connect to DB
connectDB();

// Routes
app.use('/api/products', productRoutes);
app.use("/api", salesRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
