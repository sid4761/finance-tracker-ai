import React, { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", {
        name,
        email,
        password
      });

      alert("Registration successful! Please login.");
      navigate("/");
    } catch (error) {
        console.log(error);

        const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Registration failed";

        alert(message);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #11998e, #38ef7d)",
      fontFamily: "Arial"
    }}>
      <div style={{
        background: "white",
        padding: "40px",
        borderRadius: "16px",
        width: "350px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.2)"
      }}>
        <h1 style={{ textAlign: "center" }}>Create Account</h1>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: "12px", margin: "10px 0" }}
          />

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "12px", margin: "10px 0" }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "12px", margin: "10px 0" }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "#11998e",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px"
            }}
          >
            Register
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "15px" }}>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;