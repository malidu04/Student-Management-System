const Student = require('../models/studentSchema')
const mongoose = require('mongoose')


const getStudents = async (req, res) => {
    const students = await Student.find({}).sort({createAt: -1})

    res.status(200).json(students)
}

const getStudent = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such Student'})
    }

    const student = await Student.findById(id)

    if(!student) {
        return res.staus(404).json({ error: 'No such Student'})
    }

    res.status(200).json(student)
}

const createStudent = async (req, res) => {
    const {name, email, password, profilePicture} = req.body

    let emptyFileds = []

    if (!name) {
        emptyFileds.push('name')
    }
    if (!email) {
        emptyFileds.push('email')
    }
    if (!password) {
        emptyFileds.push('password')
    }
    if (!profilePicture) {
        emptyFileds.push('profilePicture')
    }
    if (emptyFileds.length > 0) {
        return res.staus(400).json({ error: 'Please fill in all fields', emptyFileds})
    }

    try {
        const student = await Student.create({ name, email, password, profilePicture })
        res.staus(200).json(student)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const deleteStudent = async (req, res) => {
    const { id } = req.params

    if(mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such Student'})
    }

    const student = await Student.findOneAndDelete({_id: id})

    if(!student) {
        return res.status(400).json({error: 'No such Student'})
    }

    res.status(200).json(student)
}

const updateStudent = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such Student'})
    }

    const student = await Student.findByIdAndUpdate({_id: id}, {
        ...req.body
    })

    if(!student) {
        return res.status(400).json({ error: 'No such Student'})
    }

    res.status(200).json(student)
}

module.exports = {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent
}

