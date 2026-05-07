import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import { useChat } from "../../context/ChatContext";
import './Chat.css';
export default function ChatLayout() {
    const { currentConv, setCurrentConv } = useChat();

    return (
        <div className="container-fluid p-0" style={{ height: "calc(100vh - 70px)", marginTop: "70px" }}>
            <div className="row g-0 h-100">
                {/* Danh sách hội thoại: Ẩn trên mobile nếu đang chọn một chat cụ thể */}
                <div className={`${currentConv ? 'd-none d-md-block' : 'col-12'} col-md-4 col-lg-3 border-end bg-light h-100 overflow-auto`}>
                    <div className="p-3 border-bottom bg-white sticky-top">
                        <h5 className="fw-bold mb-0">Đoạn chat</h5>
                    </div>
                    <ConversationList />
                </div>

                {/* Cửa sổ Chat: Ẩn trên mobile nếu chưa chọn chat nào */}
                <div className={`${!currentConv ? 'd-none d-md-block' : 'col-12'} col-md-8 col-lg-9 h-100 bg-white`}>
                    {currentConv ? (
                        <ChatWindow onBack={() => setCurrentConv(null)} />
                    ) : (
                        <div className="h-100 d-flex align-items-center justify-content-center text-muted">
                            <h5>Chọn một hội thoại để bắt đầu</h5>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}