const express = require("express");
const router = express.Router();
const { getConversations, getMessages, getOrCreateAIConversation } = require("../../controllers/chat/chat.controller");
const { authMiddleware } = require("../../middlewares/verifyToken");
const { createConversation } = require("../../services/chat.service");

router.get("/conversations", authMiddleware, getConversations);
router.post("/conversations", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { otherUserId } = req.body;

        if (!otherUserId) {
            return res.status(400).json({
                message: "otherUserId is required"
            });
        }

        const conv = await createConversation(userId, otherUserId);

        res.json(conv);
    } catch (err) {
        console.error("CREATE CONV ERROR:", err);
        res.status(500).json({ message: err.message });
    }
});
router.post("/ai", authMiddleware, getOrCreateAIConversation);
router.get("/messages/:id", authMiddleware, getMessages);

module.exports = router;