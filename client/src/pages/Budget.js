import React, { useEffect, useState } from 'react';
import API from '../services/api';
import './Budget.css';

const Budget = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Default budget or load from localStorage
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
                setLoading(false);
            } catch (error) {
                console.error("Error fetching transactions:", error);
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

    // Calculate current month's total expenses
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentMonthSpent = transactions.reduce((sum, t) => {
        const tDate = new Date(t.date);
        if (tDate.getFullYear() === currentYear && tDate.getMonth() === currentMonth) {
            // Only sum positive amounts (expenses)
            if (Number(t.amount) > 0) {
                return sum + Number(t.amount);
            }
        }
        return sum;
    }, 0);

    const percentage = budgetLimit > 0 ? (currentMonthSpent / budgetLimit) * 100 : 0;
    const cappedPercentage = Math.min(percentage, 100);
    
    let progressClass = 'safe';
    if (percentage > 90) progressClass = 'danger';
    else if (percentage > 75) progressClass = 'warning';

    if (loading) {
        return (
            <div className="budget-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>Loading Budget Data...</p>
            </div>
        );
    }

    const monthName = new Date().toLocaleString('default', { month: 'long' });

    return (
        <div className="budget-container">
            <div className="budget-header">
                <h1>Monthly Budget Planner</h1>
                <p>Track your spending limits for {monthName} {currentYear}.</p>
            </div>

            <div className="budget-card">
                <form className="budget-form" onSubmit={handleSaveBudget}>
                    <label>Set your monthly budget limit (₹)</label>
                    <div className="budget-input-group">
                        <input
                            type="number"
                            value={inputBudget}
                            onChange={(e) => setInputBudget(e.target.value)}
                            min="1"
                            required
                        />
                        <button type="submit">Update Limit</button>
                    </div>
                </form>

                <div className="budget-status">
                    <div className="budget-amounts">
                        <h2>₹{currentMonthSpent.toLocaleString()}</h2>
                        <span>of ₹{budgetLimit.toLocaleString()} limit</span>
                    </div>

                    <div className="progress-bar-container">
                        <div 
                            className={`progress-bar ${progressClass}`} 
                            style={{ width: `${cappedPercentage}%` }}
                        ></div>
                    </div>

                    <p style={{ color: '#94a3b8', textAlign: 'right', margin: '0 0 16px 0', fontSize: '0.9rem' }}>
                        {percentage.toFixed(1)}% spent
                    </p>

                    {percentage > 100 && (
                        <div className="warning-message">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            <span>Warning: You have exceeded your monthly budget by ₹{(currentMonthSpent - budgetLimit).toLocaleString()}!</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Budget;
