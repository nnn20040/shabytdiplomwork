
import axios from 'axios';
import { ChatMessage } from '@/hooks/useGemini';

// Type definitions for Gemini API responses
interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
    finishReason: string;
  }[];
  promptFeedback: any;
}

export class GeminiService {
  private apiKey: string;
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta/models';
  private model: string = 'gemini-pro';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Method to generate text response
  async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await axios.post<GeminiResponse>(
        `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }
      );

      // Extract the generated text from the response
      const generatedText = response.data.candidates[0]?.content.parts[0]?.text || 'No response generated';
      return generatedText;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw new Error('Failed to generate response from Gemini API');
    }
  }

  // Method for chat-based interactions (conversation history)
  async chat(messages: ChatMessage[]): Promise<string> {
    try {
      // Format messages for Gemini API
      const formattedMessages = messages.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const response = await axios.post<GeminiResponse>(
        `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`,
        {
          contents: formattedMessages,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }
      );

      // Extract the generated text from the response
      const generatedText = response.data.candidates[0]?.content.parts[0]?.text || 'No response generated';
      return generatedText;
    } catch (error) {
      console.error('Error calling Gemini API for chat:', error);
      throw new Error('Failed to generate chat response from Gemini API');
    }
  }
}

// Helper function to create GeminiService instance
export const createGeminiService = (apiKey: string) => {
  return new GeminiService(apiKey);
};

export default GeminiService;
