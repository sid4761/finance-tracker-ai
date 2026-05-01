import React from 'react';
import { Link } from 'react-router-dom';
import './EmptyState.css';

const Profile = () => {
    return (
        <div className="empty-state-container">
            <div className="empty-state-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <h2 className="empty-state-title">User Profile</h2>
            <p className="empty-state-description">
                Manage your account settings, notification preferences, and export your personal data here. Stay tuned for these additions!
            </p>
            <Link to="/dashboard" className="empty-state-action">
                Go Back
            </Link>
        </div>
    );
};

export default Profile;
