const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const productRoutes = require('./routes/products');
const salesRoutes = require('./routes/sales');

const app = express();
require('dotenv').config();

// === MIDDLEWARE ===
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('uploads')); // serve image URLs like /uploads/xyz.jpg

// === CONNECT TO DB ===
connectDB();

// === ROUTES ===
app.use('/api/products', productRoutes);
app.use('/api', salesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
