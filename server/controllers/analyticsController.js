const Transaction = require("../models/Transaction");

// Monthly expense summary
const getMonthlyExpenses = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id });

        const monthly = {};

        transactions.forEach((t) => {
            const month = new Date(t.date).toLocaleString("default", {
                month: "short",
                year: "numeric"
            });

            if (!monthly[month]) {
                monthly[month] = 0;
            }

            monthly[month] += t.amount;
        });

        res.json(monthly);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Category breakdown
const getCategoryExpenses = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id });

        const categories = {};

        transactions.forEach((t) => {
            if (!categories[t.category]) {
                categories[t.category] = 0;
            }

            categories[t.category] += t.amount;
        });

        res.json(categories);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getMonthlyExpenses,
    getCategoryExpenses
};