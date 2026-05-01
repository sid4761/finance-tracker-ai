import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ toggleSidebar }) => {
    const location = useLocation();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    // Map pathnames to readable titles
    const titles = {
        '/dashboard':    'Dashboard',
        '/analytics':    'Analytics',
        '/transactions': 'Transactions',
        '/budget':       'Budget',
        '/insights':     'AI Insights',
        '/profile':      'Profile'
    };

    const currentTitle = titles[location.pathname] || 'RISE Finance';

    useEffect(() => {
        // Apply theme class to body
        if (theme === 'light') {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Update browser tab title on every navigation
    useEffect(() => {
        document.title = `${currentTitle} | RISE Finance`;
    }, [currentTitle]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };
    

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (
        <header className="navbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button className="hamburger-btn" onClick={toggleSidebar}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
                <div className="navbar-title">
                    {currentTitle}
                </div>
            </div>
            
            <div className="navbar-actions">
                <button
                    onClick={toggleTheme}
                    className="theme-toggle-btn"
                    aria-label="Toggle Theme"
                    style={{ color: theme === 'dark' ? '#f8fafc' : '#0f172a' }}
                >
                    {theme === 'dark' ? (
                        /* Sun icon — shown in dark mode to switch to light */
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                    ) : (
                        /* Moon icon — shown in light mode to switch to dark */
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                    )}
                </button>
                <button onClick={handleLogout} className="logout-nav-btn">
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Navbar;
