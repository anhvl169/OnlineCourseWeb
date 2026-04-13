const express = require('express');
const { getAllCourses } = require('../../controllers/course/getAllCourse');
const { getAllInstructors } = require('../../controllers/course/getallInstructor');

const router = express.Router();

router.get('/', getAllCourses);
router.get('/instructors', getAllInstructors);

module.exports = router;