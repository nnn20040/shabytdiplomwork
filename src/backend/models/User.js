/**
 * User model
 */

const db = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  /**
   * Create a new user
   * @param {Object} userData
   * @returns {Promise<Object>} User data without password
   */
  static async create(userData) {
    const { name, email, password, role } = userData;

    try {
      // Check if user already exists
      const existingUser = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert user into database
      const result = await db.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at',
        [name, email, hashedPassword, role || 'student']
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw error;
    }
  }

  /**
   * Find user by ID
   * @param {string} id
   * @returns {Promise<Object>} User data without password
   */
  static async findById(id) {
    try {
      const result = await db.query(
        'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
        [id]
      );

      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding user by ID:', error.message);
      throw error;
    }
  }

  /**
   * Find user by email
   * @param {string} email
   * @returns {Promise<Object>} Complete user data including password
   */
  static async findByEmail(email) {
    try {
      const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding user by email:', error.message);
      throw error;
    }
  }

  /**
   * Update user data
   * @param {string} id
   * @param {Object} userData
   * @returns {Promise<Object>} Updated user data without password
   */
  static async update(id, userData) {
    const { name, email, role } = userData;

    try {
      const result = await db.query(
        'UPDATE users SET name = $1, email = $2, role = $3, updated_at = NOW() WHERE id = $4 RETURNING id, name, email, role, created_at',
        [name, email, role, id]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error updating user:', error.message);
      throw error;
    }
  }

  /**
   * Update user password
   * @param {string} id
   * @param {string} newPassword
   * @returns {Promise<boolean>} Success status
   */
  static async updatePassword(id, newPassword) {
    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await db.query(
        'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
        [hashedPassword, id]
      );

      return true;
    } catch (error) {
      console.error('Error updating user password:', error.message);
      throw error;
    }
  }

  /**
   * Delete user
   * @param {string} id
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    try {
      await db.query('DELETE FROM users WHERE id = $1', [id]);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error.message);
      throw error;
    }
  }

  /**
   * Compare provided password with stored password
   * @param {string} providedPassword
   * @param {string} storedPassword
   * @returns {Promise<boolean>} True if passwords match
   */
  static async comparePassword(providedPassword, storedPassword) {
    return await bcrypt.compare(providedPassword, storedPassword);
  }

  /**
   * Save password reset token
   * @param {string} id
   * @param {string} resetToken
   * @param {number} resetTokenExpiry
   * @returns {Promise<boolean>} Success status
   */
  static async saveResetToken(id, resetToken, resetTokenExpiry) {
    try {
      await db.query(
        'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3',
        [resetToken, resetTokenExpiry, id]
      );
      return true;
    } catch (error) {
      console.error('Error saving reset token:', error.message);
      throw error;
    }
  }

  /**
   * Verify password reset token
   * @param {string} id
   * @param {string} token
   * @returns {Promise<boolean>} True if token is valid
   */
  static async verifyResetToken(id, token) {
    try {
      const result = await db.query(
        'SELECT reset_token, reset_token_expiry FROM users WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return false;
      }

      const user = result.rows[0];

      // Check if token matches and has not expired
      if (user.reset_token === token && user.reset_token_expiry > Date.now()) {
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error verifying reset token:', error.message);
      throw error;
    }
  }

  /**
   * Clear password reset token
   * @param {string} id
   * @returns {Promise<boolean>} Success status
   */
  static async clearResetToken(id) {
    try {
      await db.query(
        'UPDATE users SET reset_token = NULL, reset_token_expiry = NULL WHERE id = $1',
        [id]
      );
      return true;
    } catch (error) {
      console.error('Error clearing reset token:', error.message);
      throw error;
    }
  }
}

module.exports = User;
