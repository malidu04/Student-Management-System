const express = require('express')
const {
    getStudents,
    getStudent,
    createStudent,
    deleteStudent,
    updateStudent
} = require('../controllers/studentController')

const router = express.Router()

router.get('/', getStudents)

router.get('/:id', getStudent)

router.post('/', createStudent)

router.delete('/:id', deleteStudent)

router.patch('/:id', updateStudent)

module.exports = router