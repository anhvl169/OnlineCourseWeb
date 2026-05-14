import { AI_USER_ID } from "../../config/system";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
export default function MessageItem({ msg }) {
    const userId = JSON.parse(atob(localStorage.getItem("token").split('.')[1])).userId;
    const isMine = msg.senderId === userId;

    return (
        <div className={`d-flex mb-3 ${isMine ? "justify-content-end" : "justify-content-start"}`}>
            <div style={{ maxWidth: "85%" }}>
                {!isMine && (
                    <div className="small text-muted mb-1 ms-2">
                        {msg.senderName || "User"}
                    </div>
                )}
                <div className={`p-2 px-3 shadow-sm ${isMine
                    ? "bg-primary text-white rounded-4 rounded-bottom-right-0"
                    : "bg-white text-dark rounded-4 rounded-bottom-left-0 border"
                    }`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                    </ReactMarkdown>
                    {msg.sources?.length > 0 && (
                        <div className="mt-3 small">

                            <strong>Nguồn:</strong>

                            {msg.sources.map((source, index) => (
                                <div key={index}>
                                    <a
                                        href={source.url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        [{index + 1}] {source.title}
                                    </a>
                                </div>
                            ))}

                        </div>
                    )}
                </div>
                <div className={`small text-muted mt-1 ${isMine ? "text-end" : "text-start"}`} style={{ fontSize: '10px' }}>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
    );
}