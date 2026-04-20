const express = require('express');
const { getAllCourses } = require('../../controllers/course/getAllCourse');
const { getAllInstructors } = require('../../controllers/course/getallInstructor');
const { getCourseDetail } = require('../../controllers/course/getCourseDetail');
const router = express.Router();

router.get('/', getAllCourses);
router.get('/instructors', getAllInstructors);
router.get('/detail/:id', getCourseDetail);
module.exports = router;
