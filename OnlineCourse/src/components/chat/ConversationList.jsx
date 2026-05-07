import { useChat } from "../../context/ChatContext";

export default function ConversationList() {
    const { conversations, setCurrentConv, currentConv } = useChat();

    return (
        <div className="list-group list-group-flush">
            {conversations.map(c => (
                <div
                    key={c.id}
                    onClick={() => setCurrentConv(c.id)}
                    className={`list-group-item list-group-item-action border-0 py-3 px-3 ${currentConv === c.id ? "bg-primary-subtle border-start border-primary border-4" : ""}`}
                    style={{ cursor: "pointer" }}
                >
                    <div className="d-flex justify-content-between align-items-center">
                        <b className="text-truncate">Hội thoại {c.id}</b>
                        <small className="text-muted">12:45</small>
                    </div>
                    <div className="text-muted text-truncate small">
                        {typeof c.lastMessage === "object" ? c.lastMessage?.content : c.lastMessage || "Chưa có tin nhắn"}
                    </div>
                </div>
            ))}
        </div>
    );
}