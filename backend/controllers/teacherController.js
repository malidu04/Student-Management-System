const bcrypt = require('bcrypt');
const Teacher = require('../models/teacherSchema.js');
const Course = require('../models/courseSchema.js');

// Register a new teacher
const teacherRegister = async (req, res) => {
    const { name, email, password, profilePicture, teachCourse } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const existingTeacherByEmail = await Teacher.findOne({ email });
        if (existingTeacherByEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const teacher = new Teacher({
            name,
            email,
            password: hashedPass,
            profilePicture,
            teachCourse
        });

        let result = await teacher.save();

        if (teachCourse) {
            await Course.findByIdAndUpdate(teachCourse, { teacher: teacher._id });
        }

        result.password = undefined;
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Teacher login
const teacherLogIn = async (req, res) => {
    try {
        const teacher = await Teacher.findOne({ email: req.body.email });
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        const validated = await bcrypt.compare(req.body.password, teacher.password);
        if (!validated) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        teacher.password = undefined;
        res.status(200).json(teacher);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all teachers
const getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find({})
            .populate("teachCourse", "courseName");

        const modifiedTeachers = teachers.map((teacher) => {
            teacher.password = undefined;
            return teacher;
        });

        res.status(200).json(modifiedTeachers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single teacher by ID
const getTeacherDetail = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id)
            .populate("teachCourse", "courseName");

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        teacher.password = undefined;
        res.status(200).json(teacher);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update teacher's assigned course
const updateTeacherCourse = async (req, res) => {
    const { teacherId, teachCourse } = req.body;

    try {
        const updatedTeacher = await Teacher.findByIdAndUpdate(
            teacherId,
            { teachCourse },
            { new: true }
        );

        if (teachCourse) {
            await Course.findByIdAndUpdate(teachCourse, { teacher: updatedTeacher._id });
        }

        res.status(200).json(updatedTeacher);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a teacher by ID
const deleteTeacher = async (req, res) => {
    try {
        const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);

        if (deletedTeacher && deletedTeacher.teachCourse) {
            await Course.findByIdAndUpdate(deletedTeacher.teachCourse, { $unset: { teacher: "" } });
        }

        res.status(200).json(deletedTeacher);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    teacherRegister,
    teacherLogIn,
    getTeachers,
    getTeacherDetail,
    updateTeacherCourse,
    deleteTeacher
};
