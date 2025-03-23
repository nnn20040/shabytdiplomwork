
/**
 * Course routes
 */

const express = require('express');
const router = express.Router();
const courseController = require('../../controllers/courseController');
const { protect, teacherOnly } = require('../../middleware/authMiddleware');

// Get all courses (public)
router.get('/', courseController.getAllCourses);

// Search courses (public)
router.get('/search', courseController.searchCourses);

// Get course by ID (public)
router.get('/:id', courseController.getCourseById);

// Create a new course (teachers only)
router.post('/', protect, teacherOnly, courseController.createCourse);

// Update course (course teacher or admin)
router.put('/:id', protect, courseController.updateCourse);

// Delete course (course teacher or admin)
router.delete('/:id', protect, courseController.deleteCourse);

// Get teacher's courses
router.get('/teacher/my-courses', protect, teacherOnly, courseController.getTeacherCourses);

module.exports = router;
