const bcrypt = require('bcrypt');
const Student = require('../models/studentSchema.js');

// Register Student
const studentRegister = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const existingStudent = await Student.findOne({ email: req.body.email });

        if (existingStudent) {
            res.send({ message: 'Email already exists' });
        } else {
            const student = new Student({
                name: req.body.name,
                email: req.body.email,
                password: hashedPass,
                profilePicture: req.body.profilePicture || null
            });

            let result = await student.save();
            result.password = undefined;
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Student Login
const studentLogIn = async (req, res) => {
    try {
        let student = await Student.findOne({ email: req.body.email });
        if (student) {
            const validated = await bcrypt.compare(req.body.password, student.password);
            if (validated) {
                student.password = undefined;
                res.send(student);
            } else {
                res.send({ message: 'Invalid password' });
            }
        } else {
            res.send({ message: 'Student not found' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get All Students
const getStudents = async (req, res) => {
    try {
        let students = await Student.find({});
        let modifiedStudents = students.map(student => {
            student.password = undefined;
            return student;
        });
        res.send(modifiedStudents);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get Single Student Details
const getStudentDetail = async (req, res) => {
    try {
        let student = await Student.findById(req.params.id);
        if (student) {
            student.password = undefined;
            res.send(student);
        } else {
            res.send({ message: 'Student not found' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Delete Single Student
const deleteStudent = async (req, res) => {
    try {
        const result = await Student.findByIdAndDelete(req.params.id);
        res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Update Student
const updateStudent = async (req, res) => {
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        const result = await Student.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        result.password = undefined;
        res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
    studentRegister,
    studentLogIn,
    getStudents,
    getStudentDetail,
    deleteStudent,
    updateStudent,
};
