const express = require('express');
const router = express.Router();
const {
    studentRegister,
    studentLogIn,
    getStudents,
    getStudentDetail,
    deleteStudent,
    updateStudent,
} = require('../controllers/studentController');

// Student Routes
router.post('/register', studentRegister);              // Register a new student
router.post('/login', studentLogIn);                    // Student login
router.get('/', getStudents);                           // Get all students
router.get('/:id', getStudentDetail);                   // Get a single student's details by ID
router.delete('/:id', deleteStudent);                   // Delete a single student by ID
router.put('/:id', updateStudent);                      // Update a student's information by ID

module.exports = router;
