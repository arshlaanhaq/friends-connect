import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api"; 
import "../assests/register.css"

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = { username, password };

    try {
        const response = await API.post("/auth/signup", formData); 
        if (response.status === 201) {
            alert("Registration successful!");
            navigate("/login"); 
        }
    } catch (error) {
        alert("Registration failed. Please try again.");
        console.error(error);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
        <p> Have an account? <span onClick={() => navigate("/login")} className="redirect-link">Login</span></p>
      </form>
    </div>
  );
}

export default Register;
