// src/controllers/authController.js
const { sql } = require('../../config/db');
const {
    createPagination,
    calculateOffset,
    createPaginationLinks
} = require('../../utils/pagination');
const getAllCourses = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const search = req.query.search || '';
        const category = req.query.category || '';

        const offset = calculateOffset(page, limit);

        const request = new sql.Request();

        request.input('offset', sql.Int, offset);
        request.input('limit', sql.Int, limit);
        request.input('search', sql.NVarChar, search);
        request.input('category', sql.Int, category || null);

        const dataResult = await request.query(`
            SELECT *
            FROM Course
            WHERE 
                (@search = '' OR title LIKE '%' + @search + '%')
                AND (@category IS NULL OR category_id = @category)
            ORDER BY course_id
            OFFSET @offset ROWS
            FETCH NEXT @limit ROWS ONLY
        `);

        const countRequest = new sql.Request();

        countRequest.input('search', sql.NVarChar, search);
        countRequest.input('category', sql.Int, category || null);

        const countResult = await countRequest.query(`
            SELECT COUNT(*) as totalItems
            FROM Course
            WHERE 
                (@search = '' OR title LIKE '%' + @search + '%')
                AND (@category IS NULL OR category_id = @category)
        `);

        const totalItems = countResult.recordset[0].totalItems;

        const pagination = createPagination(page, limit, totalItems);

        res.json({
            data: dataResult.recordset,
            pagination
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getAllCourses };