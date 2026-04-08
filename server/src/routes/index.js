const express = require('express');

const authRoutes = require('./auth/auth.route');
const adminRoutes = require('./admin/admin.route');
const cartRoutes = require('./service/cart.route');
const categoryRoutes = require('./course/category.route');
const courseRoutes = require('./course/course.route');

const router = express.Router();


router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/cart', cartRoutes);
router.use('/categories', categoryRoutes);
router.use('/courses', courseRoutes);


const { verifyToken } = require('../middlewares/verifyToken');
router.get('/profile', verifyToken, (req, res) => {
    res.json({
        message: "Thông tin user",
        user: req.user
    });
});

module.exports = router;