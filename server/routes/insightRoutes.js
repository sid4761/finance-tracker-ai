const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getBehaviorAnalysis } = require("../controllers/insightController");

router.get("/behavior", protect, getBehaviorAnalysis);

module.exports = router;
