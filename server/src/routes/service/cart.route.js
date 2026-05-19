const express = require('express');
const { addToCart,getCartItems,removeFromCart } = require('../../controllers/service/cart.controller');
const { authMiddleware } = require('../../middlewares/verifyToken');
const { cartRateLimit } = require('../../middlewares/ratelimit/cartRateLimit');
const router = express.Router();

router.get('/', authMiddleware, getCartItems);
router.post('/add', authMiddleware, cartRateLimit, addToCart);
router.delete('/:cartItemId', authMiddleware, cartRateLimit, removeFromCart);

module.exports = router;