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

ChartJS.defaults.color = '#94a3b8';
ChartJS.defaults.borderColor = 'rgba(255, 255, 255, 0.05)';

function Dashboard() {
    const [transactions, setTransactions] = useState([]);
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [transactionType, setTransactionType] = useState("expense");

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
            const [predictRes, behaviorRes] = await Promise.all([
                API.get("/predict", config),
                API.get("/insights/behavior", config)
            ]);
            setInsight({
                prediction: predictRes.data.predictedNextMonth || 0,
                ...behaviorRes.data
            });
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

        // Save income as negative, expenses as positive to avoid DB schema changes while supporting both
        const payloadAmount = transactionType === "expense" ? Math.abs(Number(amount)) : -Math.abs(Number(amount));

        try {
            await API.post(
                "/transactions",
                {
                    amount: payloadAmount,
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

    useEffect(() => {
        getTransactions();
        getCategoryAnalytics();
        getMonthlyAnalytics();
        getAIInsights();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Calculate financials (Expenses are positive amounts, Income is negative amounts)
    const totalExpense = transactions.reduce((sum, t) => Number(t.amount) > 0 ? sum + Number(t.amount) : sum, 0);
    const totalIncome = transactions.reduce((sum, t) => Number(t.amount) < 0 ? sum + Math.abs(Number(t.amount)) : sum, 0);
    const totalBalance = totalIncome - totalExpense;

    const totalTransactions = transactions.length;



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
            if (sortOption === "highest") return Math.abs(b.amount) - Math.abs(a.amount);
            if (sortOption === "lowest") return Math.abs(a.amount) - Math.abs(b.amount);
            if (sortOption === "oldest") return new Date(a.date) - new Date(b.date);
            return new Date(b.date) - new Date(a.date);
        });

    const chartData = {
        labels: Object.keys(categoryData),
        datasets: [
            {
                data: Object.values(categoryData),
                backgroundColor: [
                    "#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#06b6d4"
                ],
                borderColor: "#1e293b",
                borderWidth: 3,
                hoverOffset: 4
            },
        ],
    };

    const monthlyChartData = {
        labels: Object.keys(monthlyData),
        datasets: [
            {
                label: "Monthly Activity",
                data: Object.values(monthlyData),
                backgroundColor: "#3b82f6",
                borderRadius: 4,
            },
        ],
    };

    return (
        <div className="dashboard-container">
            {/* Professional Summary Cards */}
            <div className="summary-container">
                <div className="summary-card">
                    <div className="summary-icon balance">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div className="summary-details">
                        <h3>Total Balance</h3>
                        <h2 style={{ color: totalBalance < 0 ? '#ef4444' : 'inherit' }}>
                            {totalBalance < 0 ? '-' : ''}₹{Math.abs(totalBalance).toLocaleString()}
                        </h2>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon income">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                    </div>
                    <div className="summary-details">
                        <h3>Total Income</h3>
                        <h2>₹{totalIncome.toLocaleString()}</h2>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon expense">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"></path></svg>
                    </div>
                    <div className="summary-details">
                        <h3>Total Expense</h3>
                        <h2>₹{totalExpense.toLocaleString()}</h2>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* Add Transaction Section (Left Column) */}
                <div className="dashboard-section col-span-4">
                    <div className="section-header">
                        <h2>Add Transaction</h2>
                    </div>
                    <form onSubmit={addTransaction} className="transaction-form">
                        <div className="type-toggle">
                            <button
                                type="button"
                                className={`type-btn expense ${transactionType === 'expense' ? 'active' : ''}`}
                                onClick={() => setTransactionType('expense')}
                            >
                                Expense
                            </button>
                            <button
                                type="button"
                                className={`type-btn income ${transactionType === 'income' ? 'active' : ''}`}
                                onClick={() => setTransactionType('income')}
                            >
                                Income
                            </button>
                        </div>
                        <div className="form-group">
                            <input
                                type="number"
                                placeholder="Amount (₹)"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                min="1"
                            />
                            <input
                                type="text"
                                placeholder={transactionType === 'expense' ? "Category (e.g. Food, Rent)" : "Category (e.g. Salary, Freelance)"}
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary">
                            Add {transactionType === 'income' ? 'Income' : 'Expense'}
                        </button>
                    </form>
                </div>

                {/* AI Insights Section (Middle Column) */}
                <div className="dashboard-section col-span-4">
                    <div className="section-header">
                        <h2>AI Financial Insights</h2>
                    </div>
                    <div className="insights-content">
                        {insight && insight.suggestion ? (
                            <>
                                <div className="insight-card" style={{ borderLeftColor: '#3b82f6' }}>
                                    <p><strong>Prediction:</strong> ₹{insight.prediction?.toLocaleString()}</p>
                                    <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Expected next month</p>
                                </div>
                                <div className="insight-card" style={{ borderLeftColor: '#8b5cf6' }}>
                                    <p><strong>Behavior:</strong> {insight.topCategory}</p>
                                    <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Highest spending category</p>
                                </div>
                                <div className="insight-card" style={{ borderLeftColor: insight.spendingLevel === 'high' ? '#ef4444' : insight.spendingLevel === 'low' ? '#10b981' : '#f59e0b', background: insight.spendingLevel === 'high' ? 'rgba(239, 68, 68, 0.1)' : insight.spendingLevel === 'low' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)' }}>
                                    <p><strong>Smart Suggestion:</strong></p>
                                    <p style={{ fontSize: '0.9rem', marginTop: '6px', lineHeight: '1.4' }}>{insight.suggestion}</p>
                                </div>
                            </>
                        ) : (
                            <p style={{ color: '#94a3b8' }}>Analyzing your financial data to generate insights...</p>
                        )}
                    </div>
                </div>

                {/* Category Chart (Right Column) */}
                <div className="dashboard-section col-span-4">
                    <div className="section-header">
                        <h2>Spending by Category</h2>
                    </div>
                    <div className="chart-container">
                        {Object.keys(categoryData).length > 0 ? (
                            <Pie data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                        ) : (
                            <p style={{ color: '#94a3b8' }}>Add expenses to see breakdown.</p>
                        )}
                    </div>
                </div>

                {/* Monthly Trend (Spans Full Width) */}
                <div className="dashboard-section col-span-12">
                    <div className="section-header">
                        <h2>Monthly Overview</h2>
                        <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{totalTransactions} total records</span>
                    </div>
                    <div className="chart-container" style={{ height: '250px' }}>
                        {Object.keys(monthlyData).length > 0 ? (
                            <Bar data={monthlyChartData} options={{ maintainAspectRatio: false }} />
                        ) : (
                            <p style={{ color: '#94a3b8' }}>No monthly data available.</p>
                        )}
                    </div>
                </div>

                {/* Recent Transactions (Spans Full Width) */}
                <div className="dashboard-section col-span-12">
                    <div className="section-header">
                        <h2>Recent Transactions</h2>
                    </div>

                    <div className="filters-group">
                        <input
                            type="text"
                            placeholder="Search category..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            {uniqueCategories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="latest">Latest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="highest">Highest Amount</option>
                            <option value="lowest">Lowest Amount</option>
                        </select>
                    </div>

                    <ul className="transaction-list">
                        {filteredTransactions.map((t) => {
                            const isExpense = Number(t.amount) > 0;
                            const displayAmount = Math.abs(Number(t.amount));
                            return (
                                <li key={t._id} className="transaction-item">
                                    <div className="transaction-info">
                                        <div className={`transaction-icon ${isExpense ? 'expense' : 'income'}`}>
                                            {isExpense ? '↓' : '↑'}
                                        </div>
                                        <div className="transaction-details">
                                            <span className="transaction-category">{t.category}</span>
                                            <span className="transaction-date">{new Date(t.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="transaction-amount-container">
                                        <span className={`transaction-amount ${isExpense ? 'expense' : 'income'}`}>
                                            {isExpense ? '-' : '+'}₹{displayAmount.toLocaleString()}
                                        </span>
                                        <button onClick={() => deleteTransaction(t._id)} className="delete-btn" aria-label="Delete">
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                        {filteredTransactions.length === 0 && (
                            <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>No transactions found.</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;