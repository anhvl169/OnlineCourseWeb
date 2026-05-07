const express = require('express');
const { authMiddleware } = require('../../middlewares/verifyToken');
const { checkRole } = require('../../middlewares/checkRole');
const {
    getStudentsByCourseId,
    getCoursesByTeacherId
} = require('../../controllers/dashboard/dashboard.controller');
const router = express.Router();

router.get(
    '/',
    authMiddleware,
    checkRole(['Teacher', 'Admin']),
    (req, res) => {
        res.json({ message: "Teacher and Admin access" });
    }
);
router.get('/courses/:id/students', authMiddleware, checkRole(['Teacher', 'Admin']), getStudentsByCourseId);
router.get('/courses/:id', authMiddleware, checkRole(['Teacher', 'Admin']), getCoursesByTeacherId);
module.exports = router;