import React from 'react';
import { useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();
    
    // Map pathnames to readable titles
    const titles = {
        '/dashboard': 'Overview Dashboard',
        '/analytics': 'Financial Analytics',
        '/transactions': 'Transaction History',
        '/budget': 'Budget Planning',
        '/insights': 'AI Recommendations',
        '/profile': 'User Profile'
    };

    const currentTitle = titles[location.pathname] || 'Dashboard';

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (
        <header className="navbar">
            <div className="navbar-title">
                {currentTitle}
            </div>
            
            <div className="navbar-actions">
                <div className="user-profile">
                    <div className="avatar">U</div>
                </div>
                <button onClick={handleLogout} className="logout-nav-btn">
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Navbar;
