const express = require('express');
const { authMiddleware } = require('../../middlewares/verifyToken');
const { checkRole } = require('../../middlewares/checkRole');

const router = express.Router();

router.get(
    '/',
    authMiddleware,
    checkRole(['Admin']),
    (req, res) => {
        res.json({ message: "Admin access" });
    }
);

module.exports = router;