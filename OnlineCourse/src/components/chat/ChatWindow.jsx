import { useChat } from "../../context/ChatContext";
import MessageInput from "./MessageInput";
import MessageItem from "./MessageItem";
import TypingIndicator from "./TypingIndicator";
import { useEffect, useRef } from "react";

export default function ChatWindow({ onBack }) {
    const { messages, typingUsers, aiTyping } = useChat();
    const bottomRef = useRef(null);

    useEffect(() => {
        // Cuộn xuống cuối mỗi khi có tin nhắn mới
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        /* h-100 đảm bảo khung chat chiếm hết chiều cao cha */
        <div className="d-flex flex-column h-100 overflow-hidden">

            {/* 1. HEADER: Luôn đứng yên */}
            <div className="p-3 border-bottom d-flex align-items-center bg-white shadow-sm" style={{ zIndex: 10 }}>
                <button className="btn d-md-none me-2 p-0" onClick={onBack}>
                    <i className="bi bi-arrow-left fs-4"></i>
                </button>
                <div>
                    <h6 className="fw-bold mb-0">Phòng Chat Trực Tuyến</h6>
                    <small className="text-success">● Đang hoạt động</small>
                </div>
            </div>

            {/* 2. TIN NHẮN: Phần duy nhất được cuộn */}
            <div
                className="flex-grow-1 p-3 bg-light"
                style={{
                    overflowY: "auto",
                    scrollBehavior: "smooth",
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                {messages.map((m) => (
                    <MessageItem key={m.id} msg={m} />
                ))}

                <TypingIndicator users={typingUsers} />
                {aiTyping && (
                    <div className="text-muted small mb-2 ms-2 italic">
                        AI đang nhập...
                    </div>
                )}

                {/* Anchor để tự động cuộn xuống */}
                <div ref={bottomRef}></div>
            </div>

            {/* 3. INPUT: Luôn đứng yên ở đáy */}
            <div className="p-3 bg-white border-top shadow-lg">
                <MessageInput />
            </div>
        </div>
    );
}