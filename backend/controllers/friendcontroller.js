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
        res.json(users);
    } catch (err) {
        console.error("Error during search:", err); 
        res.status(500).json({ error: "Error searching users" });
    }
};


exports.sendFriendRequest = async (req, res) => {
    const { senderId, receiverId } = req.body;

    try {
        // Ensure both IDs are valid ObjectIds
        if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({ error: "Invalid user IDs" });
        }

        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ error: "Receiver not found" });
        }

        if (receiver.friendRequests.includes(senderId)) {
            return res.status(400).json({ error: "Friend request already sent" });
        }

        receiver.friendRequests.push(senderId);
        await receiver.save();
        res.json({ message: "Friend request sent!" });
    } catch (err) {
        console.error("Error during sendFriendRequest:", err); // More detailed logging
        res.status(500).json({ error: "Error sending friend request", details: err.message });
    }
};


exports.handleFriendRequest = async (req, res) => {
    const { userId, senderId, action } = req.body;

    if (!userId || !senderId || !action) {
        return res.status(400).json({ error: "userId, senderId, and action are required" });
    }

    try {
        const user = await User.findById(userId);
        const sender = await User.findById(senderId);

        if (!user || !sender) {
            return res.status(404).json({ error: "User(s) not found" });
        }

        if (action === "accept") {
            if (user.friends.includes(senderId)) {
                return res.status(400).json({ error: "Already friends" });
            }
            user.friends.push(senderId);
            user.friendRequests = user.friendRequests.filter(id => id.toString() !== senderId);
            await user.save();

            sender.friends.push(userId);
            await sender.save();

            res.json({ message: "Friend request accepted!" });
        } else if (action === "reject") {
            user.friendRequests = user.friendRequests.filter(id => id.toString() !== senderId);
            await user.save();
            res.json({ message: "Friend request rejected!" });
        } else {
            res.status(400).json({ error: "Invalid action" });
        }
    } catch (err) {
        console.error("Error handling friend request:", err.message);
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
