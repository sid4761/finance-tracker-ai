const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    getMonthlyExpenses,
    getCategoryExpenses
} = require("../controllers/analyticsController");

console.log("Analytics routes loaded");

router.get("/monthly", protect, getMonthlyExpenses);
router.get("/category", protect, getCategoryExpenses);

module.exports = router;