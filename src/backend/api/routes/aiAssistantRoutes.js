
/**
 * AI Assistant routes
 */

const express = require('express');
const router = express.Router();
const aiAssistantController = require('../../controllers/aiAssistantController');
const { protect } = require('../../middleware/authMiddleware');

// Ask a question to the AI assistant
router.post('/ask', protect, aiAssistantController.askQuestion);

// Get user's AI assistant history
router.get('/history', protect, aiAssistantController.getHistory);

module.exports = router;
