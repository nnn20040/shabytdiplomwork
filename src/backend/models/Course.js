
/**
 * Course model
 */

const db = require('../config/db');

class Course {
  /**
   * Create a new course
   * @param {Object} courseData
   * @returns {Promise<Object>} Course data
   */
  static async create(courseData) {
    const { title, description, teacher_id, category, image, duration, featured } = courseData;

    try {
      const result = await db.query(
        'INSERT INTO courses (title, description, teacher_id, category, image, duration, featured) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [title, description, teacher_id, category, image, duration, featured || false]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error creating course:', error.message);
      throw error;
    }
  }

  /**
   * Find course by ID
   * @param {string} id
   * @returns {Promise<Object>} Course data
   */
  static async findById(id) {
    try {
      const result = await db.query(
        `SELECT c.*, u.name AS instructor_name
         FROM courses c
         JOIN users u ON c.teacher_id = u.id
         WHERE c.id = $1`,
        [id]
      );

      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding course by ID:', error.message);
      throw error;
    }
  }

  /**
   * Get all courses
   * @param {Object} filters Optional filters
   * @returns {Promise<Array>} Array of courses
   */
  static async getAll(filters = {}) {
    try {
      let query = `
        SELECT c.*, u.name AS instructor_name,
        (SELECT COUNT(*) FROM enrollments WHERE course_id = c.id) AS students,
        (SELECT COUNT(*) FROM lessons WHERE course_id = c.id) AS lessons
        FROM courses c
        JOIN users u ON c.teacher_id = u.id
      `;

      const whereConditions = [];
      const queryParams = [];
      let paramIndex = 1;

      if (filters.category) {
        whereConditions.push(`c.category = $${paramIndex}`);
        queryParams.push(filters.category);
        paramIndex++;
      }

      if (filters.featured) {
        whereConditions.push(`c.featured = $${paramIndex}`);
        queryParams.push(filters.featured);
        paramIndex++;
      }

      if (filters.teacher_id) {
        whereConditions.push(`c.teacher_id = $${paramIndex}`);
        queryParams.push(filters.teacher_id);
        paramIndex++;
      }

      if (whereConditions.length > 0) {
        query += ` WHERE ${whereConditions.join(' AND ')}`;
      }

      query += ' ORDER BY c.created_at DESC';

      const result = await db.query(query, queryParams);
      return result.rows;
    } catch (error) {
      console.error('Error getting all courses:', error.message);
      throw error;
    }
  }

  /**
   * Update course
   * @param {string} id
   * @param {Object} courseData
   * @returns {Promise<Object>} Updated course data
   */
  static async update(id, courseData) {
    const { title, description, category, image, duration, featured } = courseData;

    try {
      const result = await db.query(
        `UPDATE courses 
         SET title = $1, description = $2, category = $3, image = $4, duration = $5, featured = $6, updated_at = NOW()
         WHERE id = $7
         RETURNING *`,
        [title, description, category, image, duration, featured, id]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error updating course:', error.message);
      throw error;
    }
  }

  /**
   * Delete course
   * @param {string} id
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    try {
      // First delete related lessons
      await db.query('DELETE FROM lessons WHERE course_id = $1', [id]);
      
      // Then delete course
      await db.query('DELETE FROM courses WHERE id = $1', [id]);
      
      return true;
    } catch (error) {
      console.error('Error deleting course:', error.message);
      throw error;
    }
  }

  /**
   * Get courses by teacher
   * @param {string} teacherId
   * @returns {Promise<Array>} Array of courses
   */
  static async getByTeacher(teacherId) {
    try {
      const result = await db.query(
        `SELECT c.*, 
        (SELECT COUNT(*) FROM enrollments WHERE course_id = c.id) AS students,
        (SELECT COUNT(*) FROM lessons WHERE course_id = c.id) AS lessons
        FROM courses c
        WHERE c.teacher_id = $1
        ORDER BY c.created_at DESC`,
        [teacherId]
      );

      return result.rows;
    } catch (error) {
      console.error('Error getting courses by teacher:', error.message);
      throw error;
    }
  }

  /**
   * Search courses
   * @param {string} searchTerm
   * @returns {Promise<Array>} Array of courses
   */
  static async search(searchTerm) {
    try {
      const result = await db.query(
        `SELECT c.*, u.name AS instructor_name,
        (SELECT COUNT(*) FROM enrollments WHERE course_id = c.id) AS students,
        (SELECT COUNT(*) FROM lessons WHERE course_id = c.id) AS lessons
        FROM courses c
        JOIN users u ON c.teacher_id = u.id
        WHERE 
          c.title ILIKE $1 OR
          c.description ILIKE $1 OR
          c.category ILIKE $1 OR
          u.name ILIKE $1
        ORDER BY c.created_at DESC`,
        [`%${searchTerm}%`]
      );

      return result.rows;
    } catch (error) {
      console.error('Error searching courses:', error.message);
      throw error;
    }
  }
}

module.exports = Course;
