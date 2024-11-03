const express = require('express');
const router = express.Router();
const {
    teacherRegister,
    teacherLogIn,
    getTeachers,
    getTeacherDetail,
    updateTeacherCourse,
    deleteTeacher
} = require('../controllers/teacherController');

// Teacher Routes
router.post('/register', teacherRegister);           // Register a new teacher
router.post('/login', teacherLogIn);                 // Teacher login
router.get('/', getTeachers);                        // Get all teachers
router.get('/:id', getTeacherDetail);                // Get details of a single teacher by ID
router.put('/update-course', updateTeacherCourse);   // Update teacher's assigned course
router.delete('/:id', deleteTeacher);                // Delete a teacher by ID

module.exports = router;
