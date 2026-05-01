import React, { useEffect, useState } from 'react';
import API from '../services/api';
import './Budget.css';

const Budget = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [budgetLimit, setBudgetLimit] = useState(() => {
        const saved = localStorage.getItem('monthlyBudget');
        return saved ? Number(saved) : 50000;
    });

    const [inputBudget, setInputBudget] = useState(budgetLimit);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await API.get("/transactions", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTransactions(res.data);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    const handleSaveBudget = (e) => {
        e.preventDefault();
        const newBudget = Number(inputBudget);
        if (newBudget > 0) {
            setBudgetLimit(newBudget);
            localStorage.setItem('monthlyBudget', newBudget);
        }
    };

    const currentMonth = new Date().getMonth();
    const currentYear  = new Date().getFullYear();
    const monthName    = new Date().toLocaleString('default', { month: 'long' });

    const currentMonthSpent = transactions.reduce((sum, t) => {
        const tDate = new Date(t.date);
        if (tDate.getFullYear() === currentYear && tDate.getMonth() === currentMonth) {
            if (Number(t.amount) > 0) return sum + Number(t.amount);
        }
        return sum;
    }, 0);

    const remaining       = Math.max(budgetLimit - currentMonthSpent, 0);
    const percentage      = budgetLimit > 0 ? (currentMonthSpent / budgetLimit) * 100 : 0;
    const cappedPercentage = Math.min(percentage, 100);

    // Determine status tier
    let tier = 'safe';
    if (percentage > 100)     tier = 'exceeded';
    else if (percentage > 90) tier = 'danger';
    else if (percentage > 75) tier = 'warning';

    const statusConfig = {
        safe:     { label: "✓  You're within budget",   color: '#10b981', bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.25)' },
        warning:  { label: "⚠  Nearing your limit",     color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.25)' },
        danger:   { label: "⚠  Close to budget limit",  color: '#ef4444', bg: 'rgba(239, 68, 68, 0.08)',  border: 'rgba(239, 68, 68, 0.25)'  },
        exceeded: { label: "✗  Budget exceeded!",        color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)',  border: 'rgba(239, 68, 68, 0.4)'   },
    };

    const status   = statusConfig[tier];
    const barClass = tier === 'warning' ? 'warning' : tier === 'safe' ? 'safe' : 'danger';

    if (loading) {
        return (
            <div className="budget-container budget-loading">
                <div className="budget-skeleton-card">
                    <div className="skeleton-line wide"></div>
                    <div className="skeleton-line medium"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="budget-container">
            <div className="budget-header">
                <h1>Monthly Budget Planner</h1>
                <p>Track your spending limits for <strong>{monthName} {currentYear}</strong>.</p>
            </div>

            <div className="budget-card">
                {/* Card title */}
                <div className="budget-card-title">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Budget Limit
                </div>

                {/* Set limit form */}
                <form className="budget-form" onSubmit={handleSaveBudget}>
                    <label>Set your monthly spending limit (₹)</label>
                    <div className="budget-input-group">
                        <input
                            type="number"
                            value={inputBudget}
                            onChange={(e) => setInputBudget(e.target.value)}
                            min="1"
                            required
                        />
                        <button type="submit">Update</button>
                    </div>
                </form>

                {/* Stat row */}
                <div className="budget-stats">
                    <div className="budget-stat">
                        <span className="stat-label">Spent</span>
                        <span className="stat-value spent">₹{currentMonthSpent.toLocaleString()}</span>
                    </div>
                    <div className="budget-stat-divider"></div>
                    <div className="budget-stat">
                        <span className="stat-label">Limit</span>
                        <span className="stat-value">₹{budgetLimit.toLocaleString()}</span>
                    </div>
                    <div className="budget-stat-divider"></div>
                    <div className="budget-stat">
                        <span className="stat-label">Remaining</span>
                        <span className="stat-value remaining">₹{remaining.toLocaleString()}</span>
                    </div>
                </div>

                {/* Progress section */}
                <div className="budget-status">

                    {/* Percentage label row */}
                    <div className="budget-percent-row">
                        <span className="budget-percent-badge" style={{ color: status.color }}>
                            {percentage.toFixed(1)}% used
                        </span>
                        <span className="budget-percent-left" style={{ color: status.color }}>
                            {remaining > 0 ? `₹${remaining.toLocaleString()} left` : 'Over budget'}
                        </span>
                    </div>

                    {/* Progress bar */}
                    <div className="progress-bar-container">
                        <div
                            className={`progress-bar ${barClass}`}
                            style={{ width: `${cappedPercentage}%` }}
                        ></div>
                    </div>

                    {/* Tick markers */}
                    <div className="progress-markers">
                        <span>0%</span>
                        <span className="marker-75">75%</span>
                        <span className="marker-90">90%</span>
                        <span>100%</span>
                    </div>

                    {/* Status message banner */}
                    <div className="budget-status-message" style={{
                        background: status.bg,
                        border: `1px solid ${status.border}`,
                        color: status.color
                    }}>
                        <strong>{status.label}</strong>
                        {tier === 'exceeded' && (
                            <span className="exceeded-amount">
                                Over by ₹{(currentMonthSpent - budgetLimit).toLocaleString()}
                            </span>
                        )}
                        {tier === 'warning' && (
                            <span className="exceeded-amount">
                                Only ₹{remaining.toLocaleString()} remaining
                            </span>
                        )}
                        {tier === 'danger' && (
                            <span className="exceeded-amount">
                                Critical — only ₹{remaining.toLocaleString()} left
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Budget;
