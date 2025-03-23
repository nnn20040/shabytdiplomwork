
/**
 * Course controller
 */

const Course = require('../models/Course');

// Create new course
const createCourse = async (req, res) => {
  try {
    // Check if user is a teacher
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can create courses' });
    }

    const { title, description, category, image, duration, featured } = req.body;

    // Validate input
    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Create course
    const course = await Course.create({
      title,
      description,
      teacher_id: req.user.id,
      category,
      image,
      duration,
      featured: featured || false
    });

    res.status(201).json({
      success: true,
      course
    });
  } catch (error) {
    console.error('Create course error:', error.message);
    res.status(500).json({ message: 'Server error during course creation' });
  }
};

// Get all courses with filters
const getAllCourses = async (req, res) => {
  try {
    const { category, featured, teacher_id } = req.query;
    
    const filters = {};
    
    if (category) filters.category = category;
    if (featured) filters.featured = featured === 'true';
    if (teacher_id) filters.teacher_id = teacher_id;

    const courses = await Course.getAll(filters);

    res.json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    console.error('Get all courses error:', error.message);
    res.status(500).json({ message: 'Server error while retrieving courses' });
  }
};

// Get course by ID
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({
      success: true,
      course
    });
  } catch (error) {
    console.error('Get course by ID error:', error.message);
    res.status(500).json({ message: 'Server error while retrieving course' });
  }
};

// Update course
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the course
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is the teacher of this course
    if (course.teacher_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    const { title, description, category, image, duration, featured } = req.body;

    // Update course
    const updatedCourse = await Course.update(id, {
      title: title || course.title,
      description: description || course.description,
      category: category || course.category,
      image: image || course.image,
      duration: duration || course.duration,
      featured: featured !== undefined ? featured : course.featured
    });

    res.json({
      success: true,
      course: updatedCourse
    });
  } catch (error) {
    console.error('Update course error:', error.message);
    res.status(500).json({ message: 'Server error during course update' });
  }
};

// Delete course
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the course
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is the teacher of this course or an admin
    if (course.teacher_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    // Delete course
    await Course.delete(id);

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error.message);
    res.status(500).json({ message: 'Server error during course deletion' });
  }
};

// Search courses
const searchCourses = async (req, res) => {
  try {
    const { term } = req.query;
    
    if (!term) {
      return res.status(400).json({ message: 'Search term is required' });
    }

    const courses = await Course.search(term);

    res.json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    console.error('Search courses error:', error.message);
    res.status(500).json({ message: 'Server error during course search' });
  }
};

// Get teacher's courses
const getTeacherCourses = async (req, res) => {
  try {
    const courses = await Course.getByTeacher(req.user.id);

    res.json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    console.error('Get teacher courses error:', error.message);
    res.status(500).json({ message: 'Server error while retrieving teacher courses' });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  searchCourses,
  getTeacherCourses
};
