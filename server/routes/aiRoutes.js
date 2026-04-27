const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { getFinancialInsights } = require("../controllers/aiController");

console.log("AI routes loaded");

router.get("/insights", protect, getFinancialInsights);

module.exports = router;