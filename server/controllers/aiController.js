const Transaction = require("../models/Transaction");

const getFinancialInsights = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id });

        if (transactions.length === 0) {
            return res.json({ message: "No transactions available for analysis." });
        }

        let totalSpent = 0;
        const categoryTotals = {};

        transactions.forEach((t) => {
            totalSpent += t.amount;

            if (!categoryTotals[t.category]) {
                categoryTotals[t.category] = 0;
            }

            categoryTotals[t.category] += t.amount;
        });

        let topCategory = null;
        let maxSpent = 0;

        for (const category in categoryTotals) {
            if (categoryTotals[category] > maxSpent) {
                maxSpent = categoryTotals[category];
                topCategory = category;
            }
        }

        let advice = "Your spending looks balanced.";

        if (topCategory === "Food") {
            advice = "You are spending a lot on Food. Consider cooking more at home.";
        } else if (topCategory === "Shopping") {
            advice = "Shopping expenses are high. Try setting a monthly limit.";
        } else if (topCategory === "Transport") {
            advice = "Transport costs are high. Consider cheaper travel options.";
        }

        res.json({
            totalSpent,
            topCategory,
            advice
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getFinancialInsights };