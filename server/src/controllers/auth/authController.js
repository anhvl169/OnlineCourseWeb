// src/controllers/authController.js
const { sql } = require('../../config/db');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../../utils/jwt');
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Thiếu dữ liệu" });
        }

        const result = await new sql.Request()
            .input('email', sql.VarChar, email)
            .query("SELECT * FROM Users WHERE email = @email");

        const user = result.recordset[0];

        if (!user) {
            return res.status(401).json({ message: "Không tìm thấy user" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Sai mật khẩu" });
        }

        const token = generateToken(user);

        res.json({
            message: "Login thành công",
            token,
            user: {
                id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.type
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { login };