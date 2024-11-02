const mongoose = require('mongoose')

const Schema = mongoose.Schema

const teacherSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String
    },
    teachCourse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course',
    }
}, { timestamps: true })


module.exports = mongoose.model('Teacher', teacherSchema)