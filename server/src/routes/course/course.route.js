const express = require('express');
const { getAllCourses,getAllInstructors,getCourseDetail } = require('../../controllers/course/course.controller');

const router = express.Router();

router.get('/', getAllCourses);
router.get('/instructors', getAllInstructors);
router.get('/detail/:id', getCourseDetail);
module.exports = router;
