const express = require('express');
const { authMiddleware } = require('../../middlewares/verifyToken');

const router = express.Router();

router.get(
    '/',
    authMiddleware,
    (req, res) => {
        res.json({ message: "User access" });
    }
);

module.exports = router;