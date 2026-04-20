const express = require('express');

const authRoutes = require('./auth/auth.route');
const adminRoutes = require('./admin/admin.route');
const teacherRoutes = require('./teacher/teacher.route');
const cartRoutes = require('./service/cart.route');
const categoryRoutes = require('./course/category.route');
const courseRoutes = require('./course/course.route');
const userRoutes = require('./user/user.route');
const createPaymentLinkRoute = require('./payment/CollectionLink');
const router = express.Router();


router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/teachers', teacherRoutes);
router.use('/cart', cartRoutes);
router.use('/categories', categoryRoutes);
router.use('/courses', courseRoutes);
router.use('/users', userRoutes);
router.use('/payment', createPaymentLinkRoute);
const { authMiddleware } = require('../middlewares/verifyToken');
router.get('/profile', authMiddleware, (req, res) => {
    res.json({
        message: "Thông tin user",
        user: req.user
    });
});

module.exports = router;