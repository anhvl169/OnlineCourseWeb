// src/utils/jwt.js
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    console.log("USER BEFORE SIGN:", user);
    return jwt.sign(
        {
            id: user.user_id,
            name: user.name,
            role: user.type
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
};

module.exports = { generateToken };