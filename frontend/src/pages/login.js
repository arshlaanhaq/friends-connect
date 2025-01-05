import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../assests/login.css";

const Login = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState(""); // Error state
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post("/auth/login", formData);
            if (data.token) {
                localStorage.setItem("authToken", data.token);  
                navigate("/dashboard");  
            } else {
                alert("Login failed!");
            }
        } catch (error) {
            alert("Login failed!");
        }
    };
    

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login</h2>
                {error && <div className="error-message">{error}</div>}  {/* Show error message */}
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Login</button>
                <p>
                    Don't have an account? 
                    <span onClick={() => navigate("/")} className="redirect-link">
                        Register
                    </span>
                </p>
            </form>
        </div>
    );
};

export default Login;
