import React, { useState, useEffect } from 'react';
import API from '../services/api';
import './AIInsights.css';

const AIInsights = () => {
    const [insights, setInsights] = useState({
        prediction: 0,
        totalSpent: 0,
        topCategory: '',
        advice: '',
        spendingLevel: 'moderate'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };

                const [predictRes, aiRes] = await Promise.all([
                    API.get("/predict", { headers }),
                    API.get("/insights/behavior", { headers })
                ]);

                setInsights({
                    prediction: predictRes.data.predictedNextMonth || 0,
                    totalSpent: aiRes.data.totalSpent || 0,
                    topCategory: aiRes.data.topCategory || 'N/A',
                    advice: aiRes.data.suggestion || 'Keep tracking your expenses to get smart suggestions.',
                    spendingLevel: aiRes.data.spendingLevel || 'moderate'
                });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching AI insights:", error);
                setLoading(false);
            }
        };

        fetchInsights();
    }, []);

    if (loading) {
        return (
            <div className="ai-insights-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>Analyzing your financial data...</p>
            </div>
        );
    }

    return (
        <div className="ai-insights-container">
            <div className="ai-insights-header">
                <h1>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    AI Financial Intelligence
                </h1>
                <p>Actionable insights, predictions, and anomaly detection powered by your spending data.</p>
            </div>

            <div className="ai-grid">
                
                {/* Prediction Top Card */}
                <div className="ai-card col-span-12">
                    <h2>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                        Next Month's Prediction
                    </h2>
                    <div className="prediction-box">
                        <div className="prediction-amount">
                            <h3>Estimated Total Expense</h3>
                            <h1>₹{insights.prediction.toLocaleString()}</h1>
                        </div>
                    </div>
                </div>

                {/* Behavior Analysis */}
                <div className="ai-card col-span-6">
                    <h2>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z"></path></svg>
                        Behavior Analysis
                    </h2>
                    <ul className="pattern-list">
                        <li className="pattern-item">
                            <h4>Total Spending Overview</h4>
                            <p>You have spent a total of ₹{insights.totalSpent.toLocaleString()} across all recorded transactions.</p>
                        </li>
                        <li className="pattern-item">
                            <h4>Primary Expense Category</h4>
                            <p>Your highest spending is currently in the <strong>{insights.topCategory}</strong> category.</p>
                        </li>
                    </ul>
                </div>

                {/* Smart Insight */}
                <div className="ai-card col-span-6">
                    <h2>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                        Smart Suggestion
                    </h2>
                    <div className={`suggestion-item ${insights.spendingLevel}`} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h4 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>AI Recommended Action</h4>
                        <p style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>{insights.advice}</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AIInsights;
