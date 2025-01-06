import React, { useState, useEffect } from "react";
import API from "../services/api";
import Navbar from "../components/navbar";
import SearchBar from "../components/Searchbar";
import FriendsList from "../components/friendslist";
import FriendRequests from "../components/friendrequests";
import { jwtDecode } from "jwt-decode";
import "../assests/dashboard.css";

const Dashboard = () => {
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null); 
    const [name, setName] = useState(null);

    // Fetch current user ID from the JWT token
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            const decoded = jwtDecode(token);
            setCurrentUserId(decoded.id); 
            setName(decoded.name);
        }
    }, []);

    const fetchData = async () => {
        if (!currentUserId) return; // Prevent fetch if currentUserId is not available
        
        try {
            const { data: friendsList } = await API.get("/friends");
            const { data: friendRequests } = await API.get("/friends/requests");
            setFriends(friendsList);
            setRequests(friendRequests);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentUserId]); 

    const handleFriendRemoved = (friendId) => {
        setFriends((prev) => prev.filter((friend) => friend._id !== friendId));
    };

    const handleRequestHandled = (requestId) => {
        setRequests((prev) => prev.filter((request) => request._id !== requestId));
        fetchData();
    };

    const handleSendFriendRequest = async (receiverId) => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                alert("User not authenticated");
                return;
            }
    
            // Decode the token to get the user ID
            const decodedToken = jwtDecode(token);
            const senderId = decodedToken.id;
           
            // Send the friend request
            const response = await API.post(
                "/friends/send-request",
                { senderId, receiverId }, 
                {
                    headers: { Authorization: `Bearer ${token}` }, 
                }
            );
            alert(response.data.message);
            fetchData();
        } catch (error) {
            console.error("Error sending friend request:", error);
            alert(
                error.response?.data?.error || "Error occurred while sending the friend request."
            );
        }
    };
    
    return (
        <div className="dashboard-container">
            <Navbar name={name} />

            <h1 className="dashboard-heading">Welcome to Your Dashboard</h1>

            {/* Search Bar */}
            <SearchBar onResults={setSearchResults} />

            {/* Search Results */}
            <div className="search-results">
                <h2>Search Results</h2>
                <ul>
                    {searchResults.map((user) => (
                        <li key={user._id} className="search-item">
                            {user.username}
                            <button onClick={() => handleSendFriendRequest(user._id)}>Request</button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Friends List */}
            <div className="card">
                <FriendsList friends={friends} onFriendRemoved={handleFriendRemoved} />
            </div>

            {/* Friend Requests */}
            <div className="card">
                <FriendRequests requests={requests} onRequestHandled={handleRequestHandled} />
            </div>
        </div>
    );
};

export default Dashboard;
