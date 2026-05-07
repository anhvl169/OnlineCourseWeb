const chatService = require("../../services/chat.service");
const { AI_USER_ID } = require("../../config/system");

const getConversations = async (req, res) => {
    const userId = req.user.userId;

    const data = await chatService.getConversations(userId);
    res.json(data);
};

const createConversation = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { otherUserId } = req.body;

        if (!otherUserId) {
            return res.status(400).json({ message: "Missing otherUserId" });
        }

        const conv = await chatService.createConversation(userId, otherUserId);
        console.log("USER:", req.user);
        console.log("BODY:", req.body);
        res.json(conv);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const getMessages = async (req, res) => {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    console.log("page:", page, typeof page);
    console.log("limit:", limit, typeof limit);
    const data = await chatService.getMessages(id, pageNum, limitNum);
    res.json(data);
};


const getOrCreateAIConversation = async (req, res) => {
    try {

        const userId = req.user.userId;

        const conv =
            await chatService.createConversation(
                userId,
                AI_USER_ID,
                "ai"
            );

        res.json(conv);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Server error"
        });

    }
};
module.exports = {
    getConversations,
    getMessages,
    createConversation,
    getOrCreateAIConversation
};