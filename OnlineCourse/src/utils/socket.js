import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
    auth: {
        token: localStorage.getItem("token")
    }
});
socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (err) => {
    console.log("Socket error:", err.message);
});

export default socket;