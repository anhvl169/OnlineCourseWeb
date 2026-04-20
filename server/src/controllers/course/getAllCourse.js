// src/controllers/authController.js
const { sql } = require('../../config/db');
const {
    createPagination,
    calculateOffset,
    createPaginationLinks
} = require('../../utils/pagination');
const courseRepo = require('../../repositories/course.repo');
const getAllCourses = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const search = req.query.search || '';
        const category = req.query.category || '';

        const offset = calculateOffset(page, limit);

        const courses = await courseRepo.getCourses(search, category, offset, limit);
        const totalItems = await courseRepo.countCourses(search, category);
        const pagination = createPagination(page, limit, totalItems);

        res.json({
            data: courses,
            pagination
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getAllCourses };