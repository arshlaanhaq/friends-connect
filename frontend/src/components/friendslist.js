import React from "react";
import API from "../services/api";

const FriendsList = ({ friends, onFriendRemoved }) => {
    const handleUnfriend = async (friendId) => {
        try {
            const res=
            await API.post(`/friends/unfriend`, { friendId });
            onFriendRemoved(friendId); 
            alert(res.data.message)
        } catch (error) {
            console.error("Error during unfriend:", error);
        }
    };

    return (
        <div>
            <h2>Friends List</h2>
            <ul>
                {friends.map((friend) => (
                    <li key={friend._id}>
                        {friend.username}
                        <button onClick={() => handleUnfriend(friend._id)}>Unfriend</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FriendsList;
