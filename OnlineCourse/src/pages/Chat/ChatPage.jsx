import ChatLayout from "../../components/chat/ChatLayout";
import { ChatProvider } from "../../context/ChatContext";

export default function ChatPage() {
    return (
        <ChatProvider>
            <ChatLayout />
        </ChatProvider>
    );
}