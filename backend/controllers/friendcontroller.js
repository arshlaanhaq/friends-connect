const User = require("../model/User");
const mongoose = require("mongoose");
exports.searchUsers = async (req, res) => {
    const { query } = req.query;

    if (!query || typeof query !== "string" || query.trim() === "") {
        return res.status(400).json({ error: "Query parameter is required and must be a valid string" });
    }

    try {
        const users = await User.find({
            username: { $regex: query, $options: "i" },

        });
        const filteredUsers = users.filter(
            (user) => user._id.toString() !== req.userId
        );
        console.log("after: ", filteredUsers);
        
        // Return the filtered list
        res.json(filteredUsers);
    } catch (err) {
        console.error("Error during search:", err); 
        res.status(500).json({ error: "Error searching users" });
    }
};


exports.sendFriendRequest = async (req, res) => {
    const { senderId, receiverId } = req.body;

    try {
        const receiver = await User.findById(receiverId);
        if (!receiver.friendRequests.includes(senderId)) {
            receiver.friendRequests.push(senderId);
            await receiver.save();
        }
        res.json({ message: "Friend request sent!" });
    } catch (err) {
        res.status(500).json({ error: "Error sending friend request" });
    }
};


exports.handleFriendRequest = async (req, res) => {
    const { requestId, action } = req.body;

    try {
        const user = await User.findById(req.userId);
    
        if (action === "accept") {
            user.friends.push(requestId);
            user.friendRequests = user.friendRequests.filter(
                (id) => id.toString() !== requestId
            );
            await user.save();

            const sender = await User.findById(requestId);
            sender.friends.push(req.userId);
            await sender.save();

            res.json({ message: "Friend request accepted!" });
        } else if (action === "reject") {
            user.friendRequests = user.friendRequests.filter(
                (id) => id.toString() !== requestId
            );
            await user.save();
            res.json({ message: "Friend request rejected!" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error handling friend request" });
    }
};

exports.recommendFriends = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId).populate("friends");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const mutualFriends = user.friends
            .flatMap((friend) => friend.friends)
            .filter(
                (friendId) =>
                    friendId.toString() !== userId &&
                    !user.friends.some((f) => f._id.toString() === friendId.toString())
            );

        res.json(mutualFriends.length ? mutualFriends : { message: "No recommendations found" });
    } catch (err) {
        console.error("Error recommending friends:", err.message);
        res.status(500).json({ error: "Error recommending friends" });
    }
};

exports.onFriendRemoved = async (req, res) => {
    const {  friendId } = req.body;

    if (!req.userId || !friendId) {
        return res.status(400).json({ error: "User ID and Friend ID are required" });
    }

    try {
        // Remove friendId from user's friends list
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.friends = user.friends.filter(
            (id) => id.toString() !== friendId
        );
        await user.save();

        // Remove userId from friend's friends list
        const friend = await User.findById(friendId);
        if (!friend) {
            return res.status(404).json({ error: "Friend not found" });
        }

        friend.friends = friend.friends.filter(
            (id) => id.toString() !== req.userId
        );
        await friend.save();

        res.json({ message: "Friend removed successfully" });
    } catch (err) {
        console.error("Error removing friend:", err);
        res.status(500).json({ error: "Error removing friend" });
    }
};
