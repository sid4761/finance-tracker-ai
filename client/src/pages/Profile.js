import React, { useState, useEffect } from 'react';
import API from '../services/api';
import './Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError(true);
                setLoading(false);
                return;
            }

            try {
                // Primary route — /api/user/profile
                const res = await API.get("/user/profile");
                const data = res.data;
                setUser({
                    name: data.name || "Unknown User",
                    email: data.email || "No email on record",
                    memberSince: data.createdAt
                        ? new Date(data.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                        : "N/A"
                });
            } catch (primaryErr) {
                console.warn("Primary profile route failed, trying fallback...", primaryErr.message);
                try {
                    // Fallback — /api/auth/me
                    const res = await API.get("/auth/me");
                    const data = res.data;
                    setUser({
                        name: data.name || "Unknown User",
                        email: data.email || "No email on record",
                        memberSince: data.createdAt
                            ? new Date(data.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                            : "N/A"
                    });
                } catch (fallbackErr) {
                    console.error("Both profile routes failed:", fallbackErr.message);
                    setError(true);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const getInitials = (name) => {
        if (!name) return '?';
        return name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                </h1>
                <p className="profile-subtitle">Manage your account details</p>
            </div>

            <div className="profile-card">
                {loading ? (
                    <div className="profile-skeleton">
                        <div className="skeleton-avatar"></div>
                        <div className="skeleton-line wide"></div>
                        <div className="skeleton-line medium"></div>
                        <div className="skeleton-block"></div>
                        <div className="skeleton-block"></div>
                        <div className="skeleton-block"></div>
                    </div>
                ) : error ? (
                    <div className="profile-error">
                        <div className="profile-avatar-large error-avatar">!</div>
                        <h2>Could Not Load Profile</h2>
                        <p>Please make sure you are logged in and the server is running.</p>
                        <button className="btn-retry" onClick={() => window.location.reload()}>
                            Try Again
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="profile-avatar-large">
                            {getInitials(user.name)}
                        </div>

                        <h2 className="profile-name">{user.name}</h2>

                        <div className="profile-info">
                            <div className="info-group">
                                <span className="info-label">
                                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                    Email Address
                                </span>
                                <span className="info-value">{user.email}</span>
                            </div>
                            <div className="info-group">
                                <span className="info-label">
                                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                    Member Since
                                </span>
                                <span className="info-value">{user.memberSince}</span>
                            </div>
                            <div className="info-group">
                                <span className="info-label">
                                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                                    Account Status
                                </span>
                                <span className="info-value status-active">
                                    <span className="status-dot"></span>
                                    Active
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;
