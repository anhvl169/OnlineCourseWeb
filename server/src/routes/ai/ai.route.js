const express = require('express');

const router = express.Router();

const {
    askAI
} = require('../../ai/ai.controller');
const { aiRateLimitPerWeek } = require("../../middlewares/ratelimit/aiRateLimit");
router.post('/ask', aiRateLimitPerWeek, askAI);

module.exports = router;