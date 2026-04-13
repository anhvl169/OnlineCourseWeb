// src/controllers/service/addToCart.js
const { sql } = require('../../config/db');

const addToCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { courseId, price } = req.body;

        if (!courseId || !price) {
            return res.status(400).json({ message: "courseId và price là bắt buộc" });
        }

        // 1. Kiểm tra khóa học có tồn tại không
        const courseCheck = await new sql.Request()
            .input("courseId", sql.Int, courseId)
            .query("SELECT course_id FROM Course WHERE course_id = @courseId");

        if (courseCheck.recordset.length === 0) {
            return res.status(404).json({ message: "Khóa học không tồn tại" });
        }

        // 2. Tìm hoặc tạo cart cho user
        let cartResult = await new sql.Request()
            .input("userId", sql.Int, userId)
            .query("SELECT cart_id FROM Cart WHERE user_id = @userId");

        let cartId;
        if (cartResult.recordset.length === 0) {
            // Tạo cart mới
            const createCart = await new sql.Request()
                .input("userId", sql.Int, userId)
                .query("INSERT INTO Cart (user_id) VALUES (@userId); SELECT SCOPE_IDENTITY() as cart_id");
            cartId = createCart.recordset[0].cart_id;
        } else {
            cartId = cartResult.recordset[0].cart_id;
        }

        // 3. Kiểm tra khóa học đã có trong cart chưa
        const itemCheck = await new sql.Request()
            .input("cartId", sql.Int, cartId)
            .input("courseId", sql.Int, courseId)
            .query("SELECT cart_item_id FROM Cart_Item WHERE cart_id = @cartId AND course_id = @courseId");

        if (itemCheck.recordset.length > 0) {
            return res.status(400).json({ message: "Khóa học đã có trong giỏ hàng" });
        }

        // 4. Thêm item vào cart
        await new sql.Request()
            .input("cartId", sql.Int, cartId)
            .input("courseId", sql.Int, courseId)
            .input("price", sql.Float, price)
            .query(`
                INSERT INTO Cart_Item (cart_id, course_id, price)
                VALUES (@cartId, @courseId, @price)
            `);

        res.status(201).json({
            message: "Thêm vào giỏ hàng thành công",
            cartId,
            courseId
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server" });
    }
};

module.exports = { addToCart };
