const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();

const studentRoutes = require("./routes/students.js");
const teacherRoutes = require("./routes/teachers.js");
const courseRoutes = require("./routes/course.js"); // Added course routes

const PORT = process.env.PORT || 5000;

dotenv.config();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors());

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URL) // Removed deprecated options
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("NOT CONNECTED TO NETWORK", err));

// Routes
app.use('/students', studentRoutes);  // Base route for student-related endpoints
app.use('/teachers', teacherRoutes);  // Base route for teacher-related endpoints
app.use('/courses', courseRoutes);    // Base route for course-related endpoints

// Server
app.listen(PORT, () => {
    console.log(`Server started at port no. ${PORT}`);
});
