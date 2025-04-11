const Sale = require("../models/sale");
const Product = require("../models/product");

exports.checkout = async (req, res) => {
  try {
    const { name, email, password, location, gender, consent, cart } = req.body;

    // Validate all fields
    if (!name || !email || !password || !consent || !cart.length) {
      return res.status(400).json({ message: "All fields are required." });
    }
    
    if (consent === "Yes" && (!location || !gender)) {
      return res.status(400).json({ message: "Gender and Location are required when consent is Yes." });
    }

    // Check for duplicates
    const existing = await Sale.findOne({ name, email, password });
    if (existing) {
      return res.status(409).json({ message: "This customer already made a purchase." });
    }

    // Save to sales
    const sale = new Sale({ name, email, password, location, gender, consent, cart });
    await sale.save();

    // Update product quantities
    for (const item of cart) {
      const product = await Product.findById(item.id);

      if (!product) continue;

      if (product.quantity > item.quantity) {
        product.quantity -= item.quantity;
        await product.save();
      } else {
        await Product.findByIdAndDelete(item.id); // remove from DB
      }
    }

    res.status(201).json({ message: "Checkout complete", sale });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch sales." });
  }
};