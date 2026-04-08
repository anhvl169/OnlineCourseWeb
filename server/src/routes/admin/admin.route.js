const express = require('express');
const { verifyToken } = require('../../middlewares/verifyToken');
const { checkRole } = require('../../middlewares/checkRole');

const router = express.Router();

router.get('/', verifyToken, checkRole('Admin'), (req, res) => {
    res.json({ message: "Admin access" });
});

router.get('/teacher', verifyToken, checkRole('Teacher', 'Admin'), (req, res) => {
    res.json({ message: "Teacher access" });
});

module.exports = router;