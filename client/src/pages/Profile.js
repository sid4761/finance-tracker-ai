import React, { useState, useEffect } from 'react';
import API from '../services/api';
import './Profile.css';

const Profile = () => {
    const [user, setUser] = useState({
        name: "Loading...",
        email: "Loading...",
        memberSince: "..."
    });

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setUser({ name: "Not logged in", email: "Please log in again", memberSince: "" });
                return;
            }

            const headers = { Authorization: `Bearer ${token}` };

            // Try /user/profile first, fallback to /auth/me
            let data = null;
            try {
                const res = await API.get("/user/profile", { headers });
                data = res.data;
            } catch {
                try {
                    const res = await API.get("/auth/me", { headers });
                    data = res.data;
                } catch (err) {
                    console.error("Failed to fetch user data", err);
                }
            }

            if (data) {
                setUser({
                    name: data.name || "Unknown",
                    email: data.email || "Unknown",
                    memberSince: data.createdAt
                        ? new Date(data.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                        : "N/A"
                });
            } else {
                setUser({
                    name: "Unavailable",
                    email: "Could not reach server — please restart it",
                    memberSince: ""
                });
            }
        };

        fetchUser();
    }, []);

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    My Profile
                </h1>
            </div>

            <div className="profile-card">
                <div className="profile-avatar-large">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                
                <h2 style={{ margin: '0 0 24px 0', fontSize: '1.5rem', color: 'var(--text-main)' }}>{user.name}</h2>

                <div className="profile-info">
                    <div className="info-group">
                        <span className="info-label">Email Address</span>
                        <span className="info-value">{user.email}</span>
                    </div>
                    <div className="info-group">
                        <span className="info-label">Member Since</span>
                        <span className="info-value">{user.memberSince}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
