const express = require('express');
const { getCartItems } = require('../../controllers/service/getCartItems');
const { addToCart } = require('../../controllers/service/addToCart');
const { removeFromCart } = require('../../controllers/service/removeFromCart');
const { authMiddleware } = require('../../middlewares/verifyToken');

const router = express.Router();

router.get('/', authMiddleware, getCartItems);
router.post('/add', authMiddleware, addToCart);
router.delete('/:cartItemId', authMiddleware, removeFromCart);

module.exports = router;