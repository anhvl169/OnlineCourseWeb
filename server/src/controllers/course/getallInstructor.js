// src/controllers/authController.js
const { sql } = require('../../config/db');

const getAllInstructors = async (req, res) => {
    try {


        const allInstructors = await new sql.Request()
            .query("SELECT [user_id],[name] FROM [Users]");

        res.json(allInstructors.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getAllInstructors };