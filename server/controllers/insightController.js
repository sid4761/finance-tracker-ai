const Transaction = require("../models/Transaction");

const getBehaviorAnalysis = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id });

        if (transactions.length === 0) {
            return res.json({ 
                totalSpent: 0, 
                categoryWiseSpending: {}, 
                topCategory: 'N/A', 
                suggestion: "No transactions available for analysis.",
                spendingLevel: "moderate"
            });
        }

        let totalSpent = 0;
        let currentMonthSpent = 0;
        const categoryWiseSpending = {};
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        transactions.forEach((t) => {
            if (Number(t.amount) > 0) { // only consider expenses
                totalSpent += Number(t.amount);
                
                const tDate = new Date(t.date);
                if (tDate.getFullYear() === currentYear && tDate.getMonth() === currentMonth) {
                    currentMonthSpent += Number(t.amount);
                }

                if (!categoryWiseSpending[t.category]) {
                    categoryWiseSpending[t.category] = 0;
                }
                categoryWiseSpending[t.category] += Number(t.amount);
            }
        });

        let topCategory = 'N/A';
        let maxSpent = 0;

        for (const category in categoryWiseSpending) {
            if (categoryWiseSpending[category] > maxSpent) {
                maxSpent = categoryWiseSpending[category];
                topCategory = category;
            }
        }

        let spendingLevel = "moderate";
        let suggestion = "Your spending is on track.";

        if (currentMonthSpent > 50000) {
            spendingLevel = "high";
            suggestion = `Warning: Your spending this month (₹${currentMonthSpent.toLocaleString()}) is unusually high! Focus on reducing your primary expense: ${topCategory}.`;
        } else if (currentMonthSpent > 20000) {
            spendingLevel = "moderate";
            suggestion = `Your spending this month is moderate (₹${currentMonthSpent.toLocaleString()}). Keep an eye on your ${topCategory} expenses to maintain a good balance.`;
        } else {
            spendingLevel = "low";
            suggestion = `Great job! Your spending this month is low (₹${currentMonthSpent.toLocaleString()}). You are saving efficiently.`;
        }

        res.json({
            totalSpent,
            categoryWiseSpending,
            topCategory,
            suggestion,
            spendingLevel
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getBehaviorAnalysis };
