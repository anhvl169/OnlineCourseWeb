const express = require('express');
const { getCartItems } = require('../../controllers/service/getCartItems');
const { addToCart } = require('../../controllers/service/addToCart');
const { removeFromCart } = require('../../controllers/service/removeFromCart');
const { verifyToken } = require('../../middlewares/verifyToken');

const router = express.Router();

router.get('/', verifyToken, getCartItems);
router.post('/add', verifyToken, addToCart);
router.delete('/:cartItemId', verifyToken, removeFromCart);

module.exports = router;