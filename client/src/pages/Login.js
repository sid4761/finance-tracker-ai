import React, { useState, useMemo } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    // Generate random floating currency symbols
    const currencySymbols = useMemo(() => {
        const symbols = ['$', '₹', '€', '£', '¥', '₿', '¢'];
        const items = [];
        for (let i = 0; i < 20; i++) {
            const symbol = symbols[Math.floor(Math.random() * symbols.length)];
            const left = Math.random() * 100; // Random horizontal position 0-100%
            const animationDuration = 15 + Math.random() * 20; // 15s to 35s
            const animationDelay = Math.random() * -30; // Start at different times
            const fontSize = 3 + Math.random() * 7; // 3rem to 10rem

            items.push(
                <span
                    key={i}
                    className="currency-symbol"
                    style={{
                        left: `${left}%`,
                        animationDuration: `${animationDuration}s`,
                        animationDelay: `${animationDelay}s`,
                        fontSize: `${fontSize}rem`
                    }}
                >
                    {symbol}
                </span>
            );
        }
        return items;
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await API.post("/auth/login", {
                email,
                password
            });

            localStorage.setItem("token", res.data.token);
            alert("Login successful!");
            navigate("/dashboard");

        } catch (error) {
            console.log(error);

            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Login failed";

            alert(message);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-page-container">
            {/* Animated Background */}
            <div className="currency-bg">
                {currencySymbols}
            </div>

            {/* Login Card */}
            <div className="login-card glass-panel">
                <h1 className="login-title">AI Finance Tracker</h1>
                <p className="login-subtitle">Login to manage your spending</p>

                <form className="login-form" onSubmit={handleLogin}>
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="login-input"
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="login-input"
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={togglePasswordVisibility}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                /* Eye Off Icon */
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                </svg>
                            ) : (
                                /* Eye Icon */
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            )}
                        </button>
                    </div>

                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>

                <div className="register-link-container">
                    Don't have an account? <Link to="/register" className="register-link">Register</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;