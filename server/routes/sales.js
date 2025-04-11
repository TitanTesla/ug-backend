const express = require("express");
const router = express.Router();
const { checkout, getAllSales } = require("../controllers/salesController");

router.post("/checkout", checkout);
router.get("/sales", getAllSales);

module.exports = router;