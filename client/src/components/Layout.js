import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './Layout.css';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        if (window.innerWidth < 768) {
            setIsSidebarOpen(!isSidebarOpen);
        } else {
            setIsCollapsed(!isCollapsed);
        }
    };

    return (
        <div className="layout-container">
            <Sidebar isOpen={isSidebarOpen} isCollapsed={isCollapsed} setIsSidebarOpen={setIsSidebarOpen} />
            <div className="layout-main">
                <Navbar toggleSidebar={toggleSidebar} />
                <main className="layout-content">
                    {children}
                </main>
            </div>
            {isSidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
            )}
        </div>
    );
};

export default Layout;
