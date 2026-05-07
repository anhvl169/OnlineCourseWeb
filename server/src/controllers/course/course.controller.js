// src/controllers/course/course.controller.js
const { sql } = require('../../config/db');

const {
    createPagination,
    calculateOffset,
    createPaginationLinks
} = require('../../utils/pagination');

const courseRepo = require('../../repositories/course.repo');

const { getCourseById } = require('../../repositories/course.repo');

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
const getCourseDetail = async (req, res) => {
    try {
        const courseId = parseInt(req.params.id, 10);

        if (isNaN(courseId)) {
            return res.status(400).json({ message: "Invalid course id" });
        }
        const course = await getCourseById(courseId);
        if (!course || Object.keys(course).length === 0) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json({
            success: true,
            data: course
        });
    } catch (err) {
        console.error("Get course detail error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
module.exports = { getAllCate, getAllCourses, getAllInstructors, getCourseDetail };