// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require("http");
const { Server } = require("socket.io");

const { connectDB } = require('./src/config/db');
const apiRoutes = require('./src/routes/index');
console.log("SERVER VERSION NEW");
// INIT APP
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api', apiRoutes);

// CREATE SERVER
const server = http.createServer(app);

// INIT SOCKET.IO
const io = new Server(server, {
    cors: { origin: "*" }
});

// LOAD SOCKET MODULE
const initSocket = require("./src/sockets/chat.socket");

initSocket(io);

// error handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message: message,
        error: process.env.NODE_ENV === 'development' ? err : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Cannot ${req.method} ${req.path}`
    });
});

// CONNECT DB + START SERVER
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server chạy tại http://localhost:${PORT}`);
    });
});