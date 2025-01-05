const express = require("express");
const {
    searchUsers,
    sendFriendRequest,
    handleFriendRequest,
    recommendFriends,
} = require("../controllers/friendController");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../model/User");  

const router = express.Router();


router.get("/search", authMiddleware, searchUsers);


router.post("/send-request", authMiddleware, sendFriendRequest);


router.post("/handle-request", authMiddleware, handleFriendRequest);


router.get("/recommend/:userId", authMiddleware, recommendFriends);


router.get("/", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);  // Access the user from decoded token
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const friendsList = await User.find({ _id: { $in: user.friends } });
        res.json(friendsList);
    } catch (error) {
        console.error("Error fetching friends list:", error);
        res.status(500).json({ error: "Error fetching friends list" });
    }
});

router.get("/requests", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch the friend requests using `friendRequests` array
        const requests = await User.find({ _id: { $in: user.friendRequests } });

        res.json(requests);
    } catch (err) {
        console.error("Error fetching friend requests:", err);
        res.status(500).json({ error: "Error fetching friend requests" });
    }
    console.log("User Friend Requests:", User.friendRequests);
console.log("Fetched Requests:", requests);
});



module.exports = router;
