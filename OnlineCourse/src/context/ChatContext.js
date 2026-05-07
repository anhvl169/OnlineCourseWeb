import { createContext, useContext, useEffect, useState } from "react";
import socket from "../utils/socket";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [conversations, setConversations] = useState([]);
    const [currentConv, setCurrentConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [typingUsers, setTypingUsers] = useState([]);
    const [aiTyping, setAiTyping] = useState(false);
    const aiUserId = 12;
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const initialized = useRef(false);
    // load conversations
    const loadConversations = async () => {
        const res = await axios.get("http://localhost:5000/api/chat/conversations", {
            headers: { Authorization: `Bearer ${token}` }
        });
        setConversations(res.data);
        return res.data;
    };

    useEffect(() => {
        if (initialized.current) return;

        initialized.current = true;
        const initChat = async () => {

            try {
                //
                const aiRes = await axios.post(
                    "http://localhost:5000/api/chat/ai",
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                console.log("GET OR CREATE AI");
                const aiConv = aiRes.data;
                // load toàn bộ conversations
                const convs = await loadConversations();
                // nếu chưa có AI trong list
                const exists =
                    convs.some(c => c.id === aiConv.id);

                if (!exists) {
                    setConversations(prev => [
                        aiConv,
                        ...prev
                    ]);
                }
                // mặc định mở AI chat
                setCurrentConv(aiConv.id);

            } catch (err) {
                console.error(err);
            }
        };

        initChat();
        console.log("INIT CHAT");
    }, []);

    // create human conversation
    const createHumanConversation = async (otherUserId) => {

        try {

            const res = await axios.post(
                "http://localhost:5000/api/chat/conversations",
                {
                    otherUserId,
                    type: "human"
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const conv = res.data;

            setConversations(prev => {
                const exists = prev.find(c => c.id === conv.id);

                if (exists) return prev;

                return [conv, ...prev];
            });

            setCurrentConv(conv.id);

            navigate("/chat");

            return conv;

        } catch (err) {

            console.error(err);

        }
    };
    // load messages
    const loadMessages = async (convId) => {
        const res = await axios.get(`http://localhost:5000/api/chat/messages/${convId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("API MESSAGES:", res.data);
        setMessages([...res.data].reverse());
    };

    // send message
    const sendMessage = (content) => {
        console.log("SEND CONTENT:", content);
        console.log("SEND:", currentConv);
        if (!currentConv) {
            alert("Vui lòng chọn hoặc tạo cuộc hội thoại trước");
            return;
        }
        if (!content || !content.trim()) {
            console.log("EMPTY CONTENT");
            return;
        }
        socket.emit("sendMessage", {
            conversationId: currentConv,
            content
        });
    };

    // join room khi đổi chat
    useEffect(() => {
        if (currentConv) {
            console.log("JOIN + LOAD:", currentConv);
            socket.emit("joinConversation", currentConv);
            loadMessages(currentConv);
        }
    }, [currentConv]);

    // socket listeners
    useEffect(() => {
        socket.on("newMessage", (msg) => {
            setMessages(prev => [...prev, msg]);
        });
        socket.on("aiTyping", (typing) => {
            setAiTyping(typing);
        });
        socket.on("updateConversation", ({ conversationId, lastMessage }) => {
            console.log("UPDATE CONV:", conversationId, lastMessage);
            setConversations(prev =>
                prev.filter(Boolean).map(c =>
                    c.id === conversationId
                        ? { ...c, lastMessage }
                        : c
                )
            );
        });

        socket.on("typing", (userId) => {
            setTypingUsers(prev => [...new Set([...prev, userId])]);
            setTimeout(() => {
                setTypingUsers(prev => prev.filter(id => id !== userId));
            }, 2000);
        });
        console.log("Conversations:", conversations);
        return () => {
            socket.off("newMessage");
            socket.off("updateConversation");
            socket.off("typing");
            socket.off("aiTyping");
        };
    }, []);

    return (
        <ChatContext.Provider value={{
            conversations,
            currentConv,
            setCurrentConv,
            messages,
            sendMessage,
            typingUsers,
            createHumanConversation,
            aiTyping
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);