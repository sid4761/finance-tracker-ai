const Transaction = require("../models/Transaction");

const getPrediction = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user.id,
      amount: { $gt: 0 } // Only expenses
    });

    if (transactions.length === 0) {
      return res.json({ predictedNextMonth: 0 });
    }

    // Group by month-year
    const monthlyTotals = {};
    transactions.forEach(t => {
      const date = new Date(t.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      monthlyTotals[key] = (monthlyTotals[key] || 0) + Number(t.amount);
    });

    // Calculate average
    const totals = Object.values(monthlyTotals);
    const sum = totals.reduce((a, b) => a + b, 0);
    const average = sum / totals.length;

    // Round to nearest integer
    const predictedNextMonth = Math.round(average);

    res.json({ predictedNextMonth });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPrediction
};
