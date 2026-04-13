const express = require('express');
const { authMiddleware } = require('../../middlewares/verifyToken');
const { checkRole } = require('../../middlewares/checkRole');

const router = express.Router();

router.get(
    '/',
    authMiddleware,
    checkRole(['teacher', 'admin']),
    (req, res) => {
        res.json({ message: "Teacher and Admin access" });
    }
);

module.exports = router;