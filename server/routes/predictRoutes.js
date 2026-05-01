const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

// Note: @tensorflow/tfjs-node failed to compile due to missing Windows build tools.
// Falling back to standard @tensorflow/tfjs cpu backend.
const tf = require("@tensorflow/tfjs");

// Verify backend initialization
console.log(`[ML Module] TensorFlow.js initialized in route with backend: ${tf.getBackend()}`);

const { getPrediction } = require("../controllers/predictController");

router.get("/", protect, getPrediction);

module.exports = router;
