const express = require('express');
const { authMiddleware } = require('../../middlewares/verifyToken');
const router = express.Router();

router.post('/onboarding', authMiddleware);

module.exports = router;