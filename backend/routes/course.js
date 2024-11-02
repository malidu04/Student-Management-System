const express = require('express');
const {
    getCourses,
    getCourse,
    createCourse,
    assignTeacher,
    enrollStudent,
    deleteCourse,
    updateCourse
} = require('../controllers/courseController');

const router = express.Router();

// Route to get all courses
router.get('/', getCourses);

// Route to get a single course by ID
router.get('/:id', getCourse);

// Route to create a new course
router.post('/', createCourse);

// Route to assign a teacher to a course
router.post('/:courseId/assign-teacher', assignTeacher);

// Route to enroll a student in a course
router.post('/:courseId/enroll-student', enrollStudent);

// Route to delete a course by ID
router.delete('/:id', deleteCourse);

// Route to update a course by ID
router.put('/:id', updateCourse);

module.exports = router;
