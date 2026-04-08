const express = require('express');
const { getAllCate } = require('../../controllers/course/getallcate');

const router = express.Router();

router.get('/', getAllCate);

module.exports = router;