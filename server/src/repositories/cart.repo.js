const { sql } = require('./../config/db');
const createCart = async (userId) => {
    try {
        const result = await new sql.Request()
            .input("userId", sql.Int, userId)
            .query("INSERT INTO Cart (user_id) VALUES (@userId); SELECT SCOPE_IDENTITY() as cart_id");
        return result.recordset[0].cart_id;
    } catch (err) {
        console.error("Database error in createCart:", err);
        throw err;
    }
};
const findUserCartId = async (userId) => {
    try {
        const result = await new sql.Request()
            .input("userId", sql.Int, userId)
            .query("SELECT cart_id FROM Cart WHERE user_id = @userId");
        return result.recordset.length > 0 ? result.recordset[0].cart_id : null;
    } catch (err) {
        console.error("Database error in findUserCartId:", err);
        throw err;
    }
};
const getCartByUserId = async (userId) => {
    try {
        const result = await new sql.Request()
            .input("userId", sql.Int, userId)
            .query("SELECT * FROM Cart WHERE user_id = @userId");
        return result.recordset[0];
    } catch (err) {
        console.error("Database error in getCartByUserId:", err);
        throw err;
    }
};
const getCartItemsByCartId = async (cartId) => {
    try {
        const result = await new sql.Request()
            .input("cartId", sql.Int, cartId)
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
        return result.recordset;
    } catch (err) {
        console.error("Database error in getCartItemsByCartId:", err);
        throw err;
    }
};

const findCartItem = async (cartId, courseId) => {
    try {
        const itemCheck = await new sql.Request()
            .input("cartId", sql.Int, cartId)
            .input("courseId", sql.Int, courseId)
            .query("SELECT cart_item_id FROM Cart_Item WHERE cart_id = @cartId AND course_id = @courseId");
        return itemCheck.recordset[0];
    } catch (err) {
        console.error("Database error in findCartItem:", err);
        throw err;
    }
};

const getCartItemWithOwner = async (cartItemId) => {
    try {
        const itemCheck = await new sql.Request()
            .input("cartItemId", sql.Int, cartItemId)
            .query(`
                SELECT ci.cart_item_id, c.user_id, ci.price
                FROM Cart_Item ci
                JOIN Cart c ON c.cart_id = ci.cart_id
                WHERE ci.cart_item_id = @cartItemId
            `);
        return itemCheck.recordset[0] || null;
    } catch (err) {
        console.error("Database error in checkItemBelongsToUser:", err);
        throw err;
    }
};

const getCourseById = async (courseId) => {
    try {
        const courseCheck = await new sql.Request()
            .input("courseId", sql.Int, courseId)
            .query("SELECT * FROM Course WHERE course_id = @courseId");
        return courseCheck.recordset[0];
    } catch (err) {
        console.error("Database error in checkCourseExists:", err);
        throw err;
    }
};
const removeFromCart = async (cartItemId) => {

    try {
        await new sql.Request()
            .input("cartItemId", sql.Int, cartItemId)
            .query("DELETE FROM Cart_Item WHERE cart_item_id = @cartItemId");
    } catch (err) {
        console.error("Database error in removeFromCart:", err);
        throw err;
    }
};
const addToCart = async (userId, courseId, price) => {
    try {
        let cart = await getCartByUserId(userId);
        if (!cart) {
            const cartId = await createCart(userId);
            cart = { cart_id: cartId };
        }
        const exists = await findCartItem(cart.cart_id, courseId);
        if (exists) {
            throw new Error("Course đã có trong giỏ hàng");
        }
        // 4. Thêm vào cart
        await new sql.Request()
            .input("cartId", sql.Int, cart.cart_id)
            .input("courseId", sql.Int, courseId)
            .input("price", sql.Decimal(18, 2), price)
            .query("INSERT INTO Cart_Item (cart_id, course_id, price) VALUES (@cartId, @courseId, @price)");
    } catch (err) {
        console.error("Database error in addToCart:", err);
        throw err;
    }
};

module.exports = {
    createCart,
    getCartByUserId,
    getCartItemsByCartId,
    removeFromCart,
    addToCart,
    getCourseById,
    findCartItem,
    findUserCartId,
    getCartItemWithOwner
};