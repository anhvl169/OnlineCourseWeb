// src/config/db.js
const sql = require('mssql');
require('dotenv').config();
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        trustServerCertificate: true
    }
};

const connectDB = async () => {
    try {
        await sql.connect(config);
        console.log("Connected to MSSQL");
    } catch (err) {
        console.error("DB Error:", err);
    }
};

module.exports = { sql, connectDB };