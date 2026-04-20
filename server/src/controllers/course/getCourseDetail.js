const { getCourseById } = require('../../repositories/course.repo');

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

module.exports = { getCourseDetail };