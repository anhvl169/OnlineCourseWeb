// src/controllers/authController.js
const { sql } = require('../../config/db');

const getAllCourses = async (req, res) => {
    try {


        const allCourses = await new sql.Request()
            .query("SELECT * FROM Course");

        res.json(allCourses.recordset);



    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getAllCourses };