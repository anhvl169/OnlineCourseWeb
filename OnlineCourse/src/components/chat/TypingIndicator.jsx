export default function TypingIndicator({ users }) {
    if (!users.length) return null;

    return (
        <div style={{ fontSize: 12, color: "#888" }}>
            Someone is typing...
        </div>
    );
}