import React, { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

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
            alert("Login failed");
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            fontFamily: "Arial"
        }}>
            <div style={{
                background: "white",
                padding: "40px",
                borderRadius: "16px",
                width: "350px",
                boxShadow: "0 8px 25px rgba(0,0,0,0.2)"
            }}>
                <h1 style={{ textAlign: "center", color: "#333" }}>
                    AI Finance Tracker
                </h1>

                <p style={{ textAlign: "center", color: "#666" }}>
                    Login to manage your spending
                </p>

                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: "12px",
                            margin: "10px 0",
                            borderRadius: "8px",
                            border: "1px solid #ccc"
                        }}
                    />


                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                        width: "100%",
                        padding: "12px",
                        margin: "10px 0",
                        borderRadius: "8px",
                        border: "1px solid #ccc"
                    }}
                />

                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "12px",
                        background: "#667eea",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "16px",
                        marginTop: "15px",
                        cursor: "pointer"
                    }}
                >
                    Login
                </button>
            </form>

            <p style={{ textAlign: "center", marginTop: "15px" }}>
                Don't have an account? <Link to="/register">Register</Link>
            </p>
        </div>
    </div >
  );
}

export default Login;