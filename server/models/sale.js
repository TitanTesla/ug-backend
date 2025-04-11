const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    location: { type: String, required: true },
    gender: { type: String, required: true },
    consent: { type: String, enum: ["Yes", "No"], required: true },
    cart: [
      {
        id: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String,
        category: String
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sale", saleSchema);