import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({name}) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav>
            <h1 to="/dashboard">Dashboard</h1><p>{name}</p>
            <button onClick={handleLogout}>Logout</button>
        </nav>
    );
};

export default Navbar;
