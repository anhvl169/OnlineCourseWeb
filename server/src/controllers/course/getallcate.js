// src/controllers/authController.js
const { sql } = require('../../config/db');

const getAllCate = async (req, res) => {
    try {


        const allCategories = await new sql.Request()
            .query("SELECT * FROM Category");

        res.json(allCategories.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getAllCate };