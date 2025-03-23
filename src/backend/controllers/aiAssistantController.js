
/**
 * AI Assistant controller
 */

const db = require('../config/db');
const { generateAIResponse } = require('../services/aiService');

// Ask a question to AI assistant
const askQuestion = async (req, res) => {
  try {
    const { question } = req.body;
    const userId = req.user.id;

    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }

    // Generate AI response
    const response = await generateAIResponse(question, req.user.role);

    // Save the interaction in the database
    const result = await db.query(
      'INSERT INTO ai_assistant (user_id, question, response, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [userId, question, response]
    );

    const aiInteraction = result.rows[0];

    res.json({
      success: true,
      data: {
        id: aiInteraction.id,
        question: aiInteraction.question,
        response: aiInteraction.response,
        created_at: aiInteraction.created_at
      }
    });
  } catch (error) {
    console.error('Ask AI question error:', error.message);
    res.status(500).json({ message: 'Server error while processing AI request' });
  }
};

// Get user's AI assistant history
const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's AI interaction history
    const result = await db.query(
      'SELECT id, question, response, created_at FROM ai_assistant WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get AI history error:', error.message);
    res.status(500).json({ message: 'Server error while retrieving AI history' });
  }
};

module.exports = {
  askQuestion,
  getHistory
};
