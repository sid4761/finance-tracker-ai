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

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
);

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
        refreshDashboard();
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

    const cardStyle = {
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        width: "220px",
        textAlign: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    };

    const sectionStyle = {
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        width: "90%",
        maxWidth: "500px",
        margin: "20px auto",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    };

    const inputStyle = {
        padding: "10px",
        margin: "5px",
        width: "90%",
        maxWidth: "200px",
    };

    const chartData = {
        labels: Object.keys(categoryData),
        datasets: [
            {
                data: Object.values(categoryData),
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4CAF50",
                    "#9C27B0",
                ],
            },
        ],
    };

    const monthlyChartData = {
        labels: Object.keys(monthlyData),
        datasets: [
            {
                label: "Monthly Spending",
                data: Object.values(monthlyData),
                backgroundColor: "#36A2EB",
            },
        ],
    };

    return (
        <div
            style={{
                background: "#f5f7fa",
                minHeight: "100vh",
                padding: "30px",
                fontFamily: "Arial",
            }}
        >
            <button
                onClick={logout}
                style={{
                    float: "right",
                    background: "#333",
                    color: "white",
                    padding: "10px 15px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                }}
            >
                Logout
            </button>

            <h1 style={{ textAlign: "center", color: "#333" }}>
                AI Finance Dashboard
            </h1>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "20px",
                    flexWrap: "wrap",
                    marginTop: "20px",
                }}
            >
                <div style={cardStyle}>
                    <h3>This Month Spending</h3>
                    <h2>₹{thisMonthSpent}</h2>
                </div>

                <div style={cardStyle}>
                    <h3>Top Category</h3>
                    <h2>{topCategory}</h2>
                </div>

                <div style={cardStyle}>
                    <h3>Total Transactions</h3>
                    <h2>{totalTransactions}</h2>
                </div>

                <div style={cardStyle}>
                    <h3>Predicted Next Month</h3>
                    <h2>₹{predictedNextMonth}</h2>
                </div>
            </div>

            <div style={sectionStyle}>
                <h2>Add Expense</h2>

                <form onSubmit={addTransaction}>
                    <input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        style={inputStyle}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={inputStyle}
                        required
                    />

                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        style={inputStyle}
                        required
                    />

                    <button
                        type="submit"
                        style={{
                            padding: "10px 20px",
                            background: "#4CAF50",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                        }}
                    >
                        Add
                    </button>
                </form>
            </div>

            <div style={sectionStyle}>
                <h2>Spending by Category</h2>

                {Object.keys(categoryData).length > 0 ? (
                    <Pie data={chartData} />
                ) : (
                    <p>No chart data yet. Add transactions first.</p>
                )}
            </div>

            <div style={{ ...sectionStyle, maxWidth: "700px" }}>
                <h2>Monthly Spending Trend</h2>

                {Object.keys(monthlyData).length > 0 ? (
                    <Bar data={monthlyChartData} />
                ) : (
                    <p>No monthly data yet.</p>
                )}
            </div>

            <div
                style={{
                    ...sectionStyle,
                    background: "#fff3cd",
                }}
            >
                <h2>AI Financial Insights</h2>

                {insight && insight.advice ? (
                    <>
                        <p>
                            <strong>Total Spent:</strong> ₹{insight.totalSpent}
                        </p>
                        <p>
                            <strong>Top Category:</strong> {insight.topCategory}
                        </p>
                        <p>
                            <strong>Advice:</strong> {insight.advice}
                        </p>
                        <p>
                            <strong>Prediction:</strong> You may spend around ₹
                            {predictedNextMonth} next month.
                        </p>
                        <p>
                            <strong>Overspending Status:</strong> {overspendingWarning}
                        </p>
                        <p>
                            <strong>Saving Suggestion:</strong> {savingSuggestion}
                        </p>
                    </>
                ) : (
                    <p>No AI insights available yet.</p>
                )}
            </div>

            <div style={sectionStyle}>
                <h2>Recent Transactions</h2>

                <input
                    type="text"
                    placeholder="Search category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={inputStyle}
                />

                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    style={inputStyle}
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
                    style={inputStyle}
                >
                    <option value="latest">Latest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest">Highest Amount</option>
                    <option value="lowest">Lowest Amount</option>
                </select>

                <ul style={{ listStyle: "none", padding: 0 }}>
                    {filteredTransactions.map((t) => (
                        <li
                            key={t._id}
                            style={{
                                padding: "10px",
                                borderBottom: "1px solid #eee",
                                display: "flex",
                                justifyContent: "space-between",
                                gap: "10px",
                                alignItems: "center",
                                flexWrap: "wrap",
                            }}
                        >
                            <span>
                                {t.category} — ₹{t.amount} —{" "}
                                {new Date(t.date).toLocaleDateString()}
                            </span>

                            <button
                                onClick={() => deleteTransaction(t._id)}
                                style={{
                                    background: "#e74c3c",
                                    color: "white",
                                    border: "none",
                                    padding: "6px 10px",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                }}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Dashboard;