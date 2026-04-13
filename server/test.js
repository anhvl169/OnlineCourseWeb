const bcrypt = require('bcrypt');
const { connectDB } = require('./src/config/db');
const { findByEmail } = require('./src/repositories/user.repo');
const { getRolesByUserId } = require('./src/repositories/user.repo');
const { login } = require('./src/controllers/auth/authController');
const test = async () => {
    try {
        await connectDB();

        const result = await login('admin@gmail.com', '123456');

        console.log("LOGIN RESULT:", result);

    } catch (err) {
        console.error("ERROR:", err.message);
    }
};

test();