// src/controllers/service/getCartItems.js
const { sql } = require('../../config/db');

const getCartItems = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Lấy cart
        const cartResult = await new sql.Request()
            .input("userId", sql.Int, userId)
            .query("SELECT * FROM Cart WHERE user_id = @userId");

        const cart = cartResult.recordset[0];

        // chưa có cart
        if (!cart) {
            return res.json({
                items: [],
                total: 0
            });
        }

        // 2. Lấy items
        const itemsResult = await new sql.Request()
            .input("cartId", sql.Int, cart.cart_id)
            .query(`
                SELECT 
                    ci.cart_item_id,
                    ci.course_id,
                    ci.price,
                    co.title,
                    co.imgUrl
                FROM Cart_Item ci
                JOIN Course co ON co.course_id = ci.course_id
                WHERE ci.cart_id = @cartId
            `);

        const items = itemsResult.recordset;

        // 3. Tính tổng tiền
        const total = items.reduce((sum, item) => sum + item.price, 0);

        res.json({
            items,
            total
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getCartItems };