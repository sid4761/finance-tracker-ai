import React, { useEffect, useState, useMemo } from 'react';
import API from '../services/api';
import './Transactions.css';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters & Sort State
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    // sortConfig: { key: 'date' | 'amount' | 'category', direction: 'asc' | 'desc' }
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

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

    const deleteTransaction = async (id) => {
        if (!window.confirm("Are you sure you want to delete this transaction?")) return;
        try {
            const token = localStorage.getItem("token");
            await API.delete(`/transactions/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTransactions();
        } catch (error) {
            console.error(error);
            alert("Failed to delete transaction");
        }
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Derived Data: Categories
    const uniqueCategories = ["All", ...new Set(transactions.map(t => t.category))];

    // Derived Data: Filtered & Sorted
    const processedTransactions = useMemo(() => {
        let filtered = transactions.filter(t => {
            // Search by category
            const matchesSearch = t.category.toLowerCase().includes(search.toLowerCase());
            // Filter by category dropdown
            const matchesCategory = filterCategory === 'All' || t.category === filterCategory;
            // Filter by date range
            const tDate = new Date(t.date).getTime();
            const matchesStartDate = startDate ? tDate >= new Date(startDate).getTime() : true;
            // Add 1 day to endDate to include the whole day
            const matchesEndDate = endDate ? tDate <= new Date(endDate).getTime() + 86400000 : true;

            return matchesSearch && matchesCategory && matchesStartDate && matchesEndDate;
        });

        filtered.sort((a, b) => {
            if (sortConfig.key === 'date') {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
            }
            if (sortConfig.key === 'amount') {
                // Sort by absolute amount value
                const amtA = Math.abs(Number(a.amount));
                const amtB = Math.abs(Number(b.amount));
                return sortConfig.direction === 'asc' ? amtA - amtB : amtB - amtA;
            }
            if (sortConfig.key === 'category') {
                return sortConfig.direction === 'asc' 
                    ? a.category.localeCompare(b.category) 
                    : b.category.localeCompare(a.category);
            }
            return 0;
        });

        return filtered;
    }, [transactions, search, filterCategory, startDate, endDate, sortConfig]);

    if (loading) {
        return (
            <div className="transactions-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>Loading Transactions...</p>
            </div>
        );
    }

    return (
        <div className="transactions-container">
            <div className="transactions-header">
                <h1>Transaction History</h1>
                <p>View, filter, and manage all your past transactions.</p>
            </div>

            <div className="transactions-card">
                
                {/* Controls Bar */}
                <div className="controls-bar">
                    <div className="control-group">
                        <label>Search Category</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Salary, Food..." 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                        />
                    </div>
                    
                    <div className="control-group">
                        <label>Filter by Category</label>
                        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                            {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>

                    <div className="control-group">
                        <label>Start Date</label>
                        <input 
                            type="date" 
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)} 
                        />
                    </div>

                    <div className="control-group">
                        <label>End Date</label>
                        <input 
                            type="date" 
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)} 
                        />
                    </div>
                </div>

                {/* Data Table */}
                <div className="table-responsive">
                    <table className="transactions-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('date')} className={sortConfig.key === 'date' ? 'active' : ''}>
                                    Date <span className="sort-icon">{sortConfig.key === 'date' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}</span>
                                </th>
                                <th onClick={() => handleSort('category')} className={sortConfig.key === 'category' ? 'active' : ''}>
                                    Category <span className="sort-icon">{sortConfig.key === 'category' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}</span>
                                </th>
                                <th>Type</th>
                                <th onClick={() => handleSort('amount')} className={sortConfig.key === 'amount' ? 'active' : ''}>
                                    Amount <span className="sort-icon">{sortConfig.key === 'amount' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}</span>
                                </th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processedTransactions.length > 0 ? (
                                processedTransactions.map((t) => {
                                    const isExpense = Number(t.amount) > 0;
                                    const displayAmount = Math.abs(Number(t.amount));
                                    return (
                                        <tr key={t._id}>
                                            <td>{new Date(t.date).toLocaleDateString()}</td>
                                            <td>{t.category}</td>
                                            <td>
                                                <span className={`type-badge ${isExpense ? 'expense' : 'income'}`}>
                                                    {isExpense ? 'Expense' : 'Income'}
                                                </span>
                                            </td>
                                            <td className={`amount-cell ${isExpense ? 'expense' : 'income'}`}>
                                                {isExpense ? '-' : '+'}₹{displayAmount.toLocaleString()}
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <button onClick={() => deleteTransaction(t._id)} className="action-btn" title="Delete">
                                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                                        No transactions match your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Transactions;
