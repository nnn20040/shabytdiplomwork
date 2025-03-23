
/**
 * AI Assistant controller
 */

const AIService = require('../services/aiService');
const db = require('../config/db');

// Ask a question to the AI assistant
const askQuestion = async (req, res) => {
  try {
    const { question, context } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }

    // Get response from AI service
    const response = await AIService.getResponse(userId, question, context);

    // Save the interaction to database
    await AIService.saveInteraction(db, userId, question, response);

    res.json({
      success: true,
      data: {
        question,
        response,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('AI Assistant error:', error.message);
    res.status(500).json({ message: 'Error processing your question' });
  }
};

// Get user's AI assistant history
const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;

    const interactions = await AIService.getUserInteractions(db, userId, limit);

    res.json({
      success: true,
      count: interactions.length,
      data: interactions
    });
  } catch (error) {
    console.error('Get AI history error:', error.message);
    res.status(500).json({ message: 'Error retrieving AI interaction history' });
  }
};

module.exports = {
  askQuestion,
  getHistory
};
