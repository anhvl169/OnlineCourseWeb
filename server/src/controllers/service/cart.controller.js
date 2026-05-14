// src/controllers/service/addToCart.js
const { sql } = require('../../config/db');
const cartRepo = require('../../repositories/cart.repo');
const addToCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { courseId, price } = req.body;

        if (!courseId || !price) {
            return res.status(400).json({ message: "courseId và price là bắt buộc" });
        }

        // 1. Kiểm tra khóa học có tồn tại không
        const courseCheck = await cartRepo.getCourseById(courseId);

        if (!courseCheck) {
            return res.status(404).json({ message: "Khóa học không tồn tại" });
        }

        // 2. Tìm hoặc tạo cart cho user
        let cartResult = await cartRepo.findUserCartId(userId);

        let cartId;
        if (!cartResult) {
            // Tạo cart mới
            cartId = await cartRepo.createCart(userId);
        } else {
            cartId = cartResult;
        }

        // 3. Kiểm tra khóa học đã có trong cart chưa
        const itemCheck = await cartRepo.findCartItem(cartId, courseId);

        if (itemCheck) {
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
const getCartItems = async (req, res) => {
    try {
        const userId = req.user.userId;

        // 1. Lấy cart
        const cartResult = await cartRepo.getCartByUserId(userId);

        const cart = cartResult;

        // chưa có cart
        if (!cart) {
            return res.json({
                items: [],
                total: 0
            });
        }

        // 2. Lấy items
        const itemsResult = await cartRepo.getCartItemsByCartId(cart.cart_id);

        const items = itemsResult;

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

const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { cartItemId } = req.params;

        if (!cartItemId) {
            return res.status(400).json({ message: "cartItemId là bắt buộc" });
        }

        // 1. Kiểm tra item thuộc về user này không
        const itemCheck = await cartRepo.getCartItemWithOwner(cartItemId);

        if (!itemCheck) {
            return res.status(404).json({ message: "Item không tồn tại" });
        }

        if (itemCheck.user_id !== userId) {
            return res.status(403).json({ message: "Không có quyền xóa item này" });
        }

        // 2. Xóa item khỏi cart
        await cartRepo.removeFromCart(cartItemId);

        res.json({
            message: "Xóa khỏi giỏ hàng thành công",
            price: itemCheck.price
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server" });
    }
};
module.exports = { addToCart, getCartItems, removeFromCart };
