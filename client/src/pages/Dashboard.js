import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Pie, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
} from "chart.js";
import "./Dashboard.css";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
);

// Set default chart font color for dark mode
ChartJS.defaults.color = '#f8fafc'; 
ChartJS.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';

function Dashboard() {
    const [transactions, setTransactions] = useState([]);
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");

    const [categoryData, setCategoryData] = useState({});
    const [monthlyData, setMonthlyData] = useState({});
    const [insight, setInsight] = useState(null);

    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    const [sortOption, setSortOption] = useState("latest");

    const token = localStorage.getItem("token");

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const getTransactions = async () => {
        try {
            const res = await API.get("/transactions", config);
            setTransactions(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const getCategoryAnalytics = async () => {
        try {
            const res = await API.get("/analytics/category", config);
            setCategoryData(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const getMonthlyAnalytics = async () => {
        try {
            const res = await API.get("/analytics/monthly", config);
            setMonthlyData(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const getAIInsights = async () => {
        try {
            const res = await API.get("/ai/insights", config);
            setInsight(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const refreshDashboard = () => {
        getTransactions();
        getCategoryAnalytics();
        getMonthlyAnalytics();
        getAIInsights();
    };

    const addTransaction = async (e) => {
        e.preventDefault();

        try {
            await API.post(
                "/transactions",
                {
                    amount: Number(amount),
                    category,
                    date,
                    description: "Added from dashboard",
                },
                config
            );

            setAmount("");
            setCategory("");
            setDate("");

            refreshDashboard();
        } catch (error) {
            console.log(error);
            alert("Failed to add transaction");
        }
    };

    const deleteTransaction = async (id) => {
        try {
            await API.delete(`/transactions/${id}`, config);
            refreshDashboard();
        } catch (error) {
            console.log(error);
            alert("Failed to delete transaction");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    useEffect(() => {
        getTransactions();
        getCategoryAnalytics();
        getMonthlyAnalytics();
        getAIInsights();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const totalSpent = transactions.reduce(
        (sum, t) => sum + Number(t.amount),
        0
    );

    const totalTransactions = transactions.length;

    const topCategory =
        Object.keys(categoryData).length > 0
            ? Object.keys(categoryData).reduce((a, b) =>
                categoryData[a] > categoryData[b] ? a : b
            )
            : "No data";

    const thisMonthSpent = totalSpent;

    const predictedNextMonth =
        Object.values(monthlyData).length > 0
            ? Math.round(
                Object.values(monthlyData).reduce((sum, val) => sum + Number(val), 0) /
                Object.values(monthlyData).length
            )
            : 0;

    const savingSuggestion =
        topCategory !== "No data"
            ? `Try reducing ${topCategory} spending by 15% next month.`
            : "Add more transactions to generate savings suggestions.";

    const overspendingWarning =
        totalSpent > 5000
            ? "Warning: Your total spending is high this month."
            : "Your spending is currently under control.";

    const uniqueCategories = [
        "All",
        ...new Set(transactions.map((t) => t.category)),
    ];

    const filteredTransactions = transactions
        .filter((t) =>
            t.category.toLowerCase().includes(search.toLowerCase())
        )
        .filter((t) =>
            filterCategory === "All" ? true : t.category === filterCategory
        )
        .sort((a, b) => {
            if (sortOption === "highest") return b.amount - a.amount;
            if (sortOption === "lowest") return a.amount - b.amount;
            if (sortOption === "oldest") return new Date(a.date) - new Date(b.date);
            return new Date(b.date) - new Date(a.date);
        });

    const chartData = {
        labels: Object.keys(categoryData),
        datasets: [
            {
                data: Object.values(categoryData),
                backgroundColor: [
                    "#3b82f6", // Primary
                    "#8b5cf6", // Accent
                    "#10b981", // Green
                    "#f59e0b", // Yellow
                    "#ec4899", // Pink
                ],
                borderColor: "rgba(15, 23, 42, 0.8)",
                borderWidth: 2,
            },
        ],
    };

    const monthlyChartData = {
        labels: Object.keys(monthlyData),
        datasets: [
            {
                label: "Monthly Spending",
                data: Object.values(monthlyData),
                backgroundColor: "#3b82f6",
                borderRadius: 6,
            },
        ],
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1 className="dashboard-title">AI Finance Dashboard</h1>
                <button onClick={logout} className="logout-btn">
                    Logout
                </button>
            </header>

            <div className="kpi-container">
                <div className="kpi-card glass-panel">
                    <h3>This Month Spending</h3>
                    <h2>₹{thisMonthSpent}</h2>
                </div>

                <div className="kpi-card glass-panel">
                    <h3>Top Category</h3>
                    <h2>{topCategory}</h2>
                </div>

                <div className="kpi-card glass-panel">
                    <h3>Total Transactions</h3>
                    <h2>{totalTransactions}</h2>
                </div>

                <div className="kpi-card glass-panel">
                    <h3>Predicted Next Month</h3>
                    <h2>₹{predictedNextMonth}</h2>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* Add Expense Section */}
                <div className="dashboard-section glass-panel">
                    <h2>Add Expense</h2>
                    <form onSubmit={addTransaction}>
                        <div className="form-group">
                            <input
                                type="number"
                                placeholder="Amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="dashboard-input"
                                required
                                min="0"
                            />
                            <input
                                type="text"
                                placeholder="Category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="dashboard-input"
                                required
                            />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="dashboard-input"
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary">
                            Add Transaction
                        </button>
                    </form>
                </div>

                {/* AI Insights Section */}
                <div className="dashboard-section glass-panel" style={{ borderLeft: "4px solid var(--accent-color)" }}>
                    <h2>AI Financial Insights</h2>
                    <div className="insights-content">
                        {insight && insight.advice ? (
                            <>
                                <p><strong>Total Spent:</strong> ₹{insight.totalSpent}</p>
                                <p><strong>Top Category:</strong> {insight.topCategory}</p>
                                <p><strong>Advice:</strong> {insight.advice}</p>
                                <p><strong>Prediction:</strong> You may spend around ₹{predictedNextMonth} next month.</p>
                                <p><strong>Overspending Status:</strong> {overspendingWarning}</p>
                                <p><strong>Saving Suggestion:</strong> {savingSuggestion}</p>
                            </>
                        ) : (
                            <p>No AI insights available yet.</p>
                        )}
                    </div>
                </div>

                {/* Spending by Category */}
                <div className="dashboard-section glass-panel">
                    <h2>Spending by Category</h2>
                    <div className="chart-container">
                        {Object.keys(categoryData).length > 0 ? (
                            <Pie data={chartData} options={{ maintainAspectRatio: false }} />
                        ) : (
                            <p>No chart data yet. Add transactions first.</p>
                        )}
                    </div>
                </div>

                {/* Monthly Spending Trend */}
                <div className="dashboard-section glass-panel">
                    <h2>Monthly Spending Trend</h2>
                    <div className="chart-container">
                        {Object.keys(monthlyData).length > 0 ? (
                            <Bar data={monthlyChartData} options={{ maintainAspectRatio: false }} />
                        ) : (
                            <p>No monthly data yet.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="dashboard-section glass-panel">
                <h2>Recent Transactions</h2>
                
                <div className="filters-group">
                    <input
                        type="text"
                        placeholder="Search category..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="dashboard-input"
                    />
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="dashboard-input"
                    >
                        {uniqueCategories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="dashboard-input"
                    >
                        <option value="latest">Latest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="highest">Highest Amount</option>
                        <option value="lowest">Lowest Amount</option>
                    </select>
                </div>

                <ul className="transaction-list">
                    {filteredTransactions.map((t) => (
                        <li key={t._id} className="transaction-item">
                            <div className="transaction-details">
                                <span className="transaction-category">{t.category}</span>
                                <span className="transaction-date">{new Date(t.date).toLocaleDateString()}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <span className="transaction-amount">₹{t.amount}</span>
                                <button
                                    onClick={() => deleteTransaction(t._id)}
                                    className="delete-btn"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                    {filteredTransactions.length === 0 && (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No transactions found.</p>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default Dashboard;