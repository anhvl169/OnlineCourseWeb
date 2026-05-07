const express = require('express');
const { getAllCate } = require('../../controllers/course/course.controller');

const router = express.Router();

router.get('/', getAllCate);

module.exports = router;