import React, { useEffect, useState } from 'react';
import API from '../services/api';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import './Analytics.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

ChartJS.defaults.color = '#94a3b8';
ChartJS.defaults.font.family = "'Inter', sans-serif";

const Analytics = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await API.get("/transactions", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTransactions(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching transactions:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    // Filter strictly to expenses (amount > 0 based on Dashboard logic)
    const expenses = transactions.filter(t => Number(t.amount) > 0);

    // 1. Monthly Expense Data (Current Year)
    const currentYear = new Date().getFullYear();
    const monthlyTotals = new Array(12).fill(0);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    expenses.forEach(t => {
        const date = new Date(t.date);
        if (date.getFullYear() === currentYear) {
            monthlyTotals[date.getMonth()] += Number(t.amount);
        }
    });

    const monthlyLineData = {
        labels: monthNames,
        datasets: [
            {
                label: `Monthly Expenses (${currentYear})`,
                data: monthlyTotals,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#1e293b',
                pointBorderColor: '#3b82f6',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            }
        ]
    };

    // 2. Category-wise Pie Chart (All Time or could be filtered)
    const categoryMap = {};
    expenses.forEach(t => {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + Number(t.amount);
    });

    const categoryPieData = {
        labels: Object.keys(categoryMap),
        datasets: [
            {
                data: Object.values(categoryMap),
                backgroundColor: [
                    "#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#06b6d4", "#f43f5e"
                ],
                borderColor: "#1e293b",
                borderWidth: 3,
                hoverOffset: 6
            }
        ]
    };

    // 3. Weekly vs Monthly Comparison (Current Month)
    const currentMonth = new Date().getMonth();
    const weeklyTotals = [0, 0, 0, 0];
    let thisMonthTotal = 0;

    expenses.forEach(t => {
        const date = new Date(t.date);
        if (date.getFullYear() === currentYear && date.getMonth() === currentMonth) {
            const amount = Number(t.amount);
            thisMonthTotal += amount;
            const dateNum = date.getDate();
            if (dateNum <= 7) weeklyTotals[0] += amount;
            else if (dateNum <= 14) weeklyTotals[1] += amount;
            else if (dateNum <= 21) weeklyTotals[2] += amount;
            else weeklyTotals[3] += amount;
        }
    });

    const avgWeekly = thisMonthTotal / 4;

    const weeklyBarData = {
        labels: ['Week 1 (1-7)', 'Week 2 (8-14)', 'Week 3 (15-21)', 'Week 4 (22+)'],
        datasets: [
            {
                label: 'Actual Spent',
                data: weeklyTotals,
                backgroundColor: '#8b5cf6',
                borderRadius: 6,
            },
            {
                label: 'Monthly Average / Week',
                data: [avgWeekly, avgWeekly, avgWeekly, avgWeekly],
                type: 'line',
                borderColor: '#f59e0b',
                borderWidth: 2,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0,
            }
        ]
    };

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#cbd5e1', usePointStyle: true, padding: 20 }
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#f8fafc',
                bodyColor: '#cbd5e1',
                padding: 12,
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
            }
        },
        scales: {
            x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
            y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' }, beginAtZero: true }
        }
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'right', labels: { color: '#cbd5e1', usePointStyle: true, padding: 20 } }
        }
    };

    if (loading) {
        return (
            <div className="analytics-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>Loading Analytics...</p>
            </div>
        );
    }

    return (
        <div className="analytics-container">
            <div className="analytics-header">
                <h1>Financial Analytics</h1>
                <p>Deep dive into your spending habits and trends.</p>
            </div>

            <div className="analytics-grid">
                
                {/* Monthly Line Chart */}
                <div className="analytics-card col-span-12">
                    <div className="analytics-card-header">
                        <h2>Monthly Expenses Trend</h2>
                    </div>
                    <div className="chart-wrapper tall">
                        {expenses.length > 0 ? (
                            <Line data={monthlyLineData} options={commonOptions} />
                        ) : (
                            <p style={{ color: '#94a3b8' }}>No expenses recorded this year.</p>
                        )}
                    </div>
                </div>

                {/* Weekly vs Monthly Bar Chart */}
                <div className="analytics-card col-span-8">
                    <div className="analytics-card-header">
                        <h2>Weekly Breakdown ({monthNames[currentMonth]})</h2>
                    </div>
                    <div className="chart-wrapper medium">
                        {thisMonthTotal > 0 ? (
                            <Bar data={weeklyBarData} options={commonOptions} />
                        ) : (
                            <p style={{ color: '#94a3b8' }}>No expenses recorded this month.</p>
                        )}
                    </div>
                </div>

                {/* Category Pie Chart */}
                <div className="analytics-card col-span-4">
                    <div className="analytics-card-header">
                        <h2>Spending by Category</h2>
                    </div>
                    <div className="chart-wrapper pie">
                        {Object.keys(categoryMap).length > 0 ? (
                            <Pie data={categoryPieData} options={pieOptions} />
                        ) : (
                            <p style={{ color: '#94a3b8' }}>No category data available.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Analytics;
