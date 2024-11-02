const Course = require('../models/courseSchema');
const Teacher = require('../models/teacherSchema');
const Student = require('../models/studentSchema');

// Controller to get all courses
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('teacher').populate('students');
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller to get a single course by ID
const getCourse = async (req, res) => {
    const { id } = req.params;
    try {
        const course = await Course.findById(id).populate('teacher').populate('students');
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller to create a new course
const createCourse = async (req, res) => {
    const { name, description } = req.body;
    try {
        const newCourse = await Course.create({ name, description });
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller to assign a teacher to a course
const assignTeacher = async (req, res) => {
    const { courseId } = req.params;
    const { teacherId } = req.body;

    try {
        const course = await Course.findById(courseId);
        const teacher = await Teacher.findById(teacherId);

        if (!course || !teacher) {
            return res.status(404).json({ error: 'Course or Teacher not found' });
        }

        course.teacher = teacherId;
        await course.save();

        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller to enroll a student in a course
const enrollStudent = async (req, res) => {
    const { courseId } = req.params;
    const { studentId } = req.body;

    try {
        const course = await Course.findById(courseId);
        const student = await Student.findById(studentId);

        if (!course || !student) {
            return res.status(404).json({ error: 'Course or Student not found' });
        }

        // Check if the student is already enrolled
        if (course.students.includes(studentId)) {
            return res.status(400).json({ error: 'Student already enrolled' });
        }

        course.students.push(studentId);
        await course.save();

        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller to delete a course by ID
const deleteCourse = async (req, res) => {
    const { id } = req.params;

    try {
        const course = await Course.findByIdAndDelete(id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller to update a course by ID
const updateCourse = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const course = await Course.findByIdAndUpdate(id, { name, description }, { new: true });
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getCourses,
    getCourse,
    createCourse,
    assignTeacher,
    enrollStudent,
    deleteCourse,
    updateCourse
};
