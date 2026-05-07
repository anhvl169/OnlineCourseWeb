const chatRepo = require("../repositories/chat.repo");

const saveMessage = async ({
    conversationId,
    senderId,
    content
}) => {

    if (!conversationId) {
        throw new Error("conversationId required");
    }

    if (!senderId) {
        throw new Error("senderId required");
    }

    if (!content || !content.trim()) {
        throw new Error("content required");
    }

    return await chatRepo.insertMessage(
        conversationId,
        senderId,
        content.trim()
    );
};

const createConversation = async (userId, otherUserId, type) => {
    return await chatRepo.createConversation(userId, otherUserId, type);
};

const getConversations = async (userId) => {
    return await chatRepo.getUserConversations(userId);
};

const getMessages = async (conversationId, page, limit) => {
    return await chatRepo.getMessages(conversationId, page, limit);
};

const getConversationById = async (id) => {
    return await chatRepo.getConversationById(id);
};

const getOrCreateAIConversation = async (userId) => {
    return await chatRepo.createConversation(
        userId,
        AI_USER_ID,
        "ai"
    );
};

const findExistingConversation = async (userId, otherUserId) => {
    return await chatRepo.findExistingConversation(
        userId,
        otherUserId
    );
};
module.exports = {
    saveMessage,
    getConversations,
    getMessages,
    createConversation,
    getConversationById,
    getOrCreateAIConversation,
    findExistingConversation
};
