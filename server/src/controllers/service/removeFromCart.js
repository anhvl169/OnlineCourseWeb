// src/controllers/service/removeFromCart.js
const { sql } = require('../../config/db');

const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { cartItemId } = req.params;

        if (!cartItemId) {
            return res.status(400).json({ message: "cartItemId là bắt buộc" });
        }

        // 1. Kiểm tra item thuộc về user này không
        const itemCheck = await new sql.Request()
            .input("cartItemId", sql.Int, cartItemId)
            .query(`
                SELECT ci.cart_item_id, c.user_id, ci.price
                FROM Cart_Item ci
                JOIN Cart c ON c.cart_id = ci.cart_id
                WHERE ci.cart_item_id = @cartItemId
            `);

        if (itemCheck.recordset.length === 0) {
            return res.status(404).json({ message: "Item không tồn tại" });
        }

        const item = itemCheck.recordset[0];
        if (item.user_id !== userId) {
            return res.status(403).json({ message: "Không có quyền xóa item này" });
        }

        // 2. Xóa item khỏi cart
        await new sql.Request()
            .input("cartItemId", sql.Int, cartItemId)
            .query("DELETE FROM Cart_Item WHERE cart_item_id = @cartItemId");

        res.json({
            message: "Xóa khỏi giỏ hàng thành công",
            price: item.price
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server" });
    }
};

module.exports = { removeFromCart };
