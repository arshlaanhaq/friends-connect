import React, { useState } from "react";
import API from "../services/api";

const SearchBar = ({ onResults }) => {
    const [query, setQuery] = useState("");

    const handleSearch = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                alert("User not authenticated");
                return;
            }

            const { data } = await API.get(`/friends/search?query=${query}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Add the token here
                },
            });
            onResults(data); 
        } catch (error) {
            console.error("Error searching users:", error);
            alert("Failed to fetch search results.");
        }
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search for users"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
};

export default SearchBar;
