const chatService = require("../services/chat.service");
const jwt = require("../utils/jwt");
const {
    generateAIResponse
} = require("../services/ai.service");

const { AI_USER_ID } =
    require("../config/system");
const onlineUsers = new Map();

module.exports = (io) => {

    // SOCKET AUTH MIDDLEWARE
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) throw new Error("No token");

            const decoded = jwt.verifyToken(token);

            socket.user = decoded;
            socket.userId = decoded.userId;

            next();
        } catch (err) {
            next(new Error("Unauthorized"));
        }
    });

    // CONNECTION
    io.on("connection", (socket) => {

        // lưu user online
        onlineUsers.set(socket.userId, socket.id);

        // join conversation
        socket.on("joinConversation", async (conversationId) => {
            socket.join(`conv_${conversationId}`);

        });

        // SEND MESSAGE
        socket.on("sendMessage", async (data) => {

            console.log("SOCKET DATA:", data);

            try {

                // 1. save user message
                const saved =
                    await chatService.saveMessage({
                        ...data,
                        senderId: socket.userId
                    });

                // emit user message
                io.to(`conv_${data.conversationId}`)
                    .emit("newMessage", saved);

                // update sidebar
                io.to(`conv_${data.conversationId}`)
                    .emit("updateConversation", {
                        conversationId: data.conversationId,
                        lastMessage: saved
                    });

                // 2. lấy conversation
                const conversation =
                    await chatService.getConversationById(
                        data.conversationId
                    );

                // 3. nếu là AI chat
                if (conversation.type === "ai") {

                    // typing fake
                    io.to(`conv_${data.conversationId}`)
                        .emit("aiTyping", true);

                    // generate AI
                    const aiResult =
                        await generateAIResponse(
                            data.content
                        );
                    console.log("AI RESULT:", aiResult);
                    // save AI message
                    const aiSaved =
                        await chatService.saveMessage({
                            conversationId:
                                data.conversationId,

                            senderId: AI_USER_ID,

                            content: aiResult.answer,
                            sources: aiResult.sources
                        });

                    // stop typing
                    io.to(`conv_${data.conversationId}`)
                        .emit("aiTyping", false);

                    // emit AI message
                    io.to(`conv_${data.conversationId}`)
                        .emit("newMessage", { ...aiSaved, sources: aiResult.sources });

                    io.to(`conv_${data.conversationId}`)
                        .emit("updateConversation", {
                            conversationId: data.conversationId,
                            lastMessage: aiSaved
                        });
                }

            } catch (err) {

                console.error("SEND MESSAGE ERROR:", err);
            }
        });

        // DISCONNECT
        socket.on("disconnect", () => {
            onlineUsers.delete(socket.userId);
        });
    });
};