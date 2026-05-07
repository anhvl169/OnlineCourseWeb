const { AI_USER_ID } = require("../../config/system");

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