require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./src/config/db');

const app = express();

app.use(cors());
app.use(express.json());

// Add logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

connectDB();

const apiRoutes = require('./src/routes/index');
app.use('/api', apiRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server chạy tại http://localhost:${process.env.PORT}`);
});