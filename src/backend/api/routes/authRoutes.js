
/**
 * Authentication routes
 */

const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');
const { protect } = require('../../middleware/authMiddleware');

// Register a new user
router.post('/register', authController.register);

// Login a user
router.post('/login', authController.login);

// Get current user
router.get('/me', protect, authController.getCurrentUser);

// Update user profile
router.put('/profile', protect, authController.updateProfile);

// Change password
router.put('/change-password', protect, authController.changePassword);

// Forgot password - request reset
router.post('/forgot-password', authController.forgotPassword);

// Reset password with token
router.post('/reset-password', authController.resetPassword);

module.exports = router;
