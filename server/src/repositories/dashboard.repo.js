const { sql } = require('./../config/db');

const getStudentByCourseId = async (courseId) => {
    try {
        const request = new sql.Request();
        request.input('courseId', sql.Int, courseId);
        const result = await request.query(`
        SELECT u.user_id, u.name, u.email
        FROM Enrollment e
        JOIN Users u ON e.user_id = u.user_id
        WHERE e.course_id = @courseId
    `);
        return result.recordset;
    } catch (err) {
        console.error("Database error in getStudentByCourseId:", err);
        throw new Error('Database error');
    }
};

const getCoursesByTeacherId = async (teacherId) => {
    try {
        const request = new sql.Request();
        request.input('teacherId', sql.Int, teacherId);
        const result = await request.query(`
        SELECT course_id, title,[status],imgUrl,category_id
        FROM Course
        WHERE instructor_id = @teacherId
    `);
        return result.recordset;
    } catch (err) {
        console.error("Database error in getCoursesByTeacherId:", err);
        throw new Error('Database error');
    }
};

module.exports = {
    getStudentByCourseId,
    getCoursesByTeacherId
};