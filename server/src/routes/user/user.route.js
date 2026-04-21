const express = require('express');
const { authMiddleware } = require('../../middlewares/verifyToken');
const {
    getUserProfile,
    updateUserProfile,
    getEnrolledCourses,
    getUserInvoices,
    getInvoiceDetails
} = require('../../controllers/user/userController');

const router = express.Router();

router.get(
    '/',
    authMiddleware,
    (req, res) => {
        res.json({ message: "User access" });
    }
);

// Lấy thông tin profile người dùng
router.get('/profile/:userId', authMiddleware, getUserProfile);

// Cập nhật thông tin profile người dùng
router.put('/profile/:userId', authMiddleware, updateUserProfile);

// Lấy danh sách khóa đã tham gia
router.get('/enrolled-courses/:userId', authMiddleware, getEnrolledCourses);

// Lấy danh sách hóa đơn
router.get('/invoices/:userId', authMiddleware, getUserInvoices);

// Lấy chi tiết hóa đơn
router.get('/invoice/:invoiceId/details', authMiddleware, getInvoiceDetails);

module.exports = router;