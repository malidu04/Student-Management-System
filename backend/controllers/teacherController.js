const Teacher = require('../models/teacherSchema')
const mongoose = require('mongoose')


const getTeachers = async (req, res) => {
    const teachers = await Teacher.find({}).sort({createAt: -1})

    res.status(200).json(teachers)
}

const getTeacher = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such Teacher'})
    }

    const teacher = await Teacher.findById(id)

    if(!teacher) {
        return res.staus(404).json({ error: 'No such Teacher'})
    }

    res.status(200).json(teacher)
}

const createTeacher = async (req, res) => {
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
        const teacher = await Teacher.create({ name, email, password, profilePicture })
        res.staus(200).json(teacher)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const deleteTeacher = async (req, res) => {
    const { id } = req.params

    if(mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such Teacher'})
    }

    const teacher = await Teacher.findOneAndDelete({_id: id})

    if(!teacher) {
        return res.status(400).json({error: 'No such Teacher'})
    }

    res.status(200).json(teacher)
}

const updateTeacher = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such Teacher'})
    }

    const teacher = await Teacher.findByIdAndUpdate({_id: id}, {
        ...req.body
    })

    if(!teacher) {
        return res.status(400).json({ error: 'No such Teacher'})
    }

    res.status(200).json(teacher)
}

module.exports = {
    getTeachers,
    getTeacher,
    createTeacher,
    updateTeacher,
    deleteTeacher
}

