import React from 'react';
import './AIInsights.css';

const AIInsights = () => {
    // Mock Data for AI Insights
    const mockData = {
        predictedExpense: 42500,
        trendAmount: 2500,
        trendDirection: 'up', // 'up' or 'down'
        trendPercentage: 5.8,
        
        patterns: [
            {
                id: 1,
                title: "Weekend Dining Spikes",
                description: "You consistently spend 60% of your Food & Dining budget on weekends. Consider meal prepping to balance this out."
            },
            {
                id: 2,
                title: "Subscription Creep",
                description: "Your monthly recurring payments have increased by ₹1,200 over the last 3 months. Review your recent subscriptions."
            },
            {
                id: 3,
                title: "Consistent Saving",
                description: "Great job! You always transfer funds to your savings account in the first week of the month."
            }
        ],

        suggestions: [
            {
                id: 1,
                title: "Negotiate Internet Bill",
                description: "Users with similar usage patterns are paying 15% less for internet. Consider calling your provider to negotiate.",
                actionText: "Review Bill"
            },
            {
                id: 2,
                title: "Optimize Grocery Shopping",
                description: "Buying groceries bi-weekly instead of every few days could save you an estimated ₹3,000 this month based on your history.",
                actionText: "Set Grocery Budget"
            },
            {
                id: 3,
                title: "Invest Idle Cash",
                description: "You have ₹50,000 sitting idle in your checking account. Moving this to a high-yield savings could earn you ₹200/month.",
                actionText: "Explore Options"
            }
        ]
    };

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
                            <h1>₹{mockData.predictedExpense.toLocaleString()}</h1>
                        </div>
                        <div className="prediction-trend">
                            <div className={`trend-badge ${mockData.trendDirection}`}>
                                {mockData.trendDirection === 'up' ? '↑' : '↓'} 
                                {mockData.trendPercentage}% (₹{mockData.trendAmount.toLocaleString()})
                            </div>
                            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>vs. current month</span>
                        </div>
                    </div>
                </div>

                {/* Spending Patterns */}
                <div className="ai-card col-span-6">
                    <h2>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z"></path></svg>
                        Identified Spending Patterns
                    </h2>
                    <ul className="pattern-list">
                        {mockData.patterns.map(pattern => (
                            <li key={pattern.id} className="pattern-item">
                                <h4>{pattern.title}</h4>
                                <p>{pattern.description}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Smart Suggestions */}
                <div className="ai-card col-span-6">
                    <h2>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                        Smart Suggestions
                    </h2>
                    <ul className="suggestion-list">
                        {mockData.suggestions.map(suggestion => (
                            <li key={suggestion.id} className="suggestion-item">
                                <h4>{suggestion.title}</h4>
                                <p>{suggestion.description}</p>
                                <button className="suggestion-action">{suggestion.actionText}</button>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    );
};

export default AIInsights;
