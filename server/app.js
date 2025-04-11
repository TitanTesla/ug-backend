const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const productRoutes = require('./routes/products');
const salesRoutes = require("./routes/sales");
const path = require('path');
const allowedOrigins = [
  "http://localhost:3002",
  "http://127.0.0.1:3002",
  "https://your-github-pages-url", // Optional for GitHub Pages
];


const app = express();
require('dotenv').config();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to DB
connectDB();

// Routes
app.use('/api/products', productRoutes);
app.use("/api", salesRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
