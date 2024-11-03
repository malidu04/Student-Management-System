const router = require('express').Router();
const {
    createCourse,
    getAllCourses,
    getCoursesByTeacher,
    getCourseDetail,
    getFreeCourses,
    deleteCourse,
} = require('../controllers/courseController');

// Course Routes
router.post('/CourseCreate', createCourse);                 // Create a new course
router.get('/Courses', getAllCourses);                     // Get all courses
router.get('/Courses/Teacher/:teacherId', getCoursesByTeacher); // Get courses by specific teacher
router.get('/Course/:id', getCourseDetail);                // Get details of a single course
router.get('/FreeCourses', getFreeCourses);                // Get all courses without assigned teachers (free courses)
router.delete('/Course/:id', deleteCourse);                // Delete a single course

module.exports = router;
