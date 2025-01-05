import React from "react";
import API from "../services/api";

const FriendRequests = ({ requests, onRequestHandled }) => {
    const handleRequest = async (requestId, action) => {
        try {
            await API.post(`/friends/handle-request`, { requestId, action });
            onRequestHandled(requestId); 
        } catch (error) {
            console.error("Error handling friend request:", error);
        }
    };

    return (
        <div>
            <h2>Friend Requests</h2>
            <ul>
                {requests.map((request) => (
                    <li key={request._id}>
                        {request.username}
                        <button onClick={() => handleRequest(request._id, "accept")}>
                            Accept
                        </button>
                        <button onClick={() => handleRequest(request._id, "reject")}>
                            Reject
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FriendRequests;
