const express = require('express');

const router = express.Router();

const {
    askAI
} = require('../../ai/ai.controller');

router.post('/ask', askAI);

module.exports = router;