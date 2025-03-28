
import { useState } from 'react';
import { createGeminiService } from '@/services/geminiService';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export const useGemini = (apiKey: string | null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Check if API key is available
  const isConfigured = !!apiKey;

  // Reset conversation history
  const resetChat = () => {
    setMessages([]);
    setError(null);
  };

  // Send a message to Gemini API
  const sendMessage = async (userMessage: string): Promise<string | null> => {
    if (!apiKey) {
      setError('API key is required');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Add user message to conversation
      const updatedMessages: ChatMessage[] = [
        ...messages,
        { role: 'user', content: userMessage }
      ];
      setMessages(updatedMessages);

      // Create Gemini service and send request
      const geminiService = createGeminiService(apiKey);
      const response = await geminiService.chat(updatedMessages);
      
      // Add AI response to conversation
      const newMessage: ChatMessage = { role: 'model', content: response };
      setMessages([...updatedMessages, newMessage]);
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isConfigured,
    isLoading,
    error,
    messages,
    sendMessage,
    resetChat
  };
};

export default useGemini;
