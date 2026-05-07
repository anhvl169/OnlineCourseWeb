const { sql } = require('../../config/db');
const dashboardRepo = require('../../repositories/dashboard.repo');

const getStudentsByCourseId = async (req, res) => {
    try {
        const courseId = parseInt(req.params.id);
        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required" });
        }
        const students = await dashboardRepo.getStudentByCourseId(courseId);
        res.json(students);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const getCoursesByTeacherId = async (req, res) => {
    try {
        const teacherId = req.params.id;
        if (!teacherId) {
            return res.status(400).json({ message: "Teacher ID is required" });
        }
        const courses = await dashboardRepo.getCoursesByTeacherId(teacherId);
        res.json(courses);
        console.log("Courses fetched for teacher ID:", teacherId, courses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getStudentsByCourseId,
    getCoursesByTeacherId
};