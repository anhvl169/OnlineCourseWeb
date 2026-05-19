const express = require("express");
const router = express.Router();
const { getConversations, getMessages, getOrCreateAIConversation, createConversation } = require("../../controllers/chat/chat.controller");
const { authMiddleware } = require("../../middlewares/verifyToken");
const { aiRateLimitPerMinute } = require("../../middlewares/ratelimit/aiRateLimit");
const { recommendCourses } = require("../../controllers/ai/openai.controller");
router.get("/conversations", authMiddleware, getConversations);
router.post("/conversations", authMiddleware, createConversation);
router.post("/ai", authMiddleware, aiRateLimitPerMinute, getOrCreateAIConversation);
router.get("/messages/:id", authMiddleware, getMessages);
router.post("/recommend", authMiddleware, recommendCourses);

module.exports = router;