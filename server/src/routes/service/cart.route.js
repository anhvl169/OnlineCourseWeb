const express = require('express');
const { addToCart,getCartItems,removeFromCart } = require('../../controllers/service/cart.controller');
const { authMiddleware } = require('../../middlewares/verifyToken');

const router = express.Router();

router.get('/', authMiddleware, getCartItems);
router.post('/add', authMiddleware, addToCart);
router.delete('/:cartItemId', authMiddleware, removeFromCart);

module.exports = router;