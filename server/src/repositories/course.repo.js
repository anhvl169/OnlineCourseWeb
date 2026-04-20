const { sql } = require('./../config/db');
const getCourses = async (search, category, offset, limit) => {
    try {
        const request = new sql.Request();
        request.input('offset', sql.Int, offset);
        request.input('limit', sql.Int, limit);
        request.input('search', sql.NVarChar, search);
        request.input('category', sql.Int, category || null);
        const result = await request.query(`
        SELECT *
        FROM Course
        WHERE 
            (@search = '' OR title LIKE '%' + @search + '%')
            AND (@category IS NULL OR category_id = @category)
        ORDER BY course_id
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
    `);
        return result.recordset;
    } catch (err) {
        console.error("Database error in getCourses:", err);
        throw new Error('Database error');
    }
};
const countCourses = async (search, category) => {
    try {
        const request = new sql.Request();
        request.input('search', sql.NVarChar, search);
        request.input('category', sql.Int, category || null);
        const result = await request.query(`
        SELECT COUNT(*) as totalItems
        FROM Course
        WHERE
            (@search = '' OR title LIKE '%' + @search + '%')
            AND (@category IS NULL OR category_id = @category)
    `);
        return result.recordset[0].totalItems;
    } catch (err) {
        console.error("Database error in countCourses:", err);
        throw new Error('Database error');
    }
};

const getCourseById = async (courseId) => {
    try {
        const request = new sql.Request();
        request.input('courseId', sql.Int, courseId);
        const result = await request.query(`
        SELECT *
        FROM Course
        WHERE course_id = @courseId
    `);
        return result.recordset[0];
    } catch (err) {
        console.error("Database error in getCourseById:", err);
        throw new Error('Database error');
    }
};

module.exports = {
    getCourses,
    countCourses,
    getCourseById
};