import { useState } from "react";
import { useChat } from "../../context/ChatContext";
import socket from "../../utils/socket";

export default function MessageInput() {
    const [text, setText] = useState("");
    const { sendMessage, currentConv } = useChat();

    const handleSend = () => {
        if (!text.trim()) return;
        sendMessage(text);
        setText("");
    };

    const handleTyping = () => {
        socket.emit("typing", { conversationId: currentConv });
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="d-flex p-2 border-top">
            <input
                className="form-control"
                value={text}
                onChange={(e) => {
                    setText(e.target.value);
                    handleTyping();
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
            />
            <button className="btn btn-primary ms-2" onClick={handleSend}>
                Send
            </button>
        </div>
    );
}