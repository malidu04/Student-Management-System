const Course = require('../models/courseSchema.js');
const Teacher = require('../models/teacherSchema.js');
const Student = require('../models/studentSchema.js');

// Create a new course
const createCourse = async (req, res) => {
    try {
        const { name, courseID, description, teacher, students } = req.body;

        const existingCourseByCourseID = await Course.findOne({ courseID });
        if (existingCourseByCourseID) {
            return res.status(400).json({ message: 'Course ID must be unique; it already exists' });
        }

        const newCourse = new Course({
            name,
            courseID,
            description,
            teacher,
            students,
        });

        const result = await newCourse.save();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get all courses for a specific school or admin
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({})
            .populate("teacher", "name")
            .populate("students", "name");

        if (courses.length > 0) {
            res.json(courses);
        } else {
            res.status(404).json({ message: "No courses found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get courses by specific teacher
const getCoursesByTeacher = async (req, res) => {
    try {
        const courses = await Course.find({ teacher: req.params.teacherId })
            .populate("teacher", "name")
            .populate("students", "name");

        if (courses.length > 0) {
            res.json(courses);
        } else {
            res.status(404).json({ message: "No courses found for this teacher" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get details of a single course
const getCourseDetail = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate("teacher", "name")
            .populate("students", "name");

        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ message: "Course not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get all courses without assigned teachers (free courses)
const getFreeCourses = async (req, res) => {
    try {
        const courses = await Course.find({ teacher: { $exists: false } });
        if (courses.length > 0) {
            res.json(courses);
        } else {
            res.status(404).json({ message: "No free courses found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Delete a single course
const deleteCourse = async (req, res) => {
    try {
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);

        if (deletedCourse) {
            await Teacher.updateOne(
                { teachCourse: deletedCourse._id },
                { $unset: { teachCourse: "" } }
            );

            await Student.updateMany(
                {},
                { $pull: { courses: deletedCourse._id } }
            );

            res.json(deletedCourse);
        } else {
            res.status(404).json({ message: "Course not found" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

// Delete all courses by a specific admin or school
const deleteCoursesByAdmin = async (req, res) => {
    try {
        const deletedCourses = await Course.deleteMany({ adminID: req.params.id });

        await Teacher.updateMany(
            { teachCourse: { $in: deletedCourses.map(course => course._id) } },
            { $unset: { teachCourse: "" } }
        );

        await Student.updateMany(
            {},
            { $pull: { courses: { $in: deletedCourses.map(course => course._id) } } }
        );

        res.json(deletedCourses);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Delete all courses by specific class
const deleteCoursesByClass = async (req, res) => {
    try {
        const deletedCourses = await Course.deleteMany({ classId: req.params.id });

        await Teacher.updateMany(
            { teachCourse: { $in: deletedCourses.map(course => course._id) } },
            { $unset: { teachCourse: "" } }
        );

        await Student.updateMany(
            {},
            { $pull: { courses: { $in: deletedCourses.map(course => course._id) } } }
        );

        res.json(deletedCourses);
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
    createCourse,
    getAllCourses,
    getCoursesByTeacher,
    getCourseDetail,
    getFreeCourses,
    deleteCourse,
    deleteCoursesByAdmin,
    deleteCoursesByClass,
};
