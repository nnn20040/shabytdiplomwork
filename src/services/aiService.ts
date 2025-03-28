
import { toast } from 'sonner';

// API URL for Google's Gemini API
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
// Default API key for Gemini (should be replaced with proper key management in production)
const DEFAULT_GEMINI_API_KEY = 'YOUR_DEFAULT_GEMINI_API_KEY'; // This is a placeholder

// We'll still use localStorage to store the key if user provides their own
export const setApiKey = (key: string) => {
  localStorage.setItem('gemini_api_key', key);
  return true;
};

export const getApiKey = () => {
  return localStorage.getItem('gemini_api_key') || DEFAULT_GEMINI_API_KEY;
};

export interface AIResponse {
  text: string;
  sources?: { title: string; url: string }[];
}

export const askAI = async (question: string): Promise<AIResponse> => {
  const apiKey = getApiKey();
  
  try {
    // For testing in development without actual API calls
    if (process.env.NODE_ENV === 'development' && !apiKey) {
      return getFallbackResponse(question);
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Ты образовательный ассистент для сайта Shabyt. 
                Отвечай на вопросы студентов о математике, физике, истории, биологии и другим школьным предметам. 
                Давай четкие, точные и краткие ответы. Используй научный подход и достоверную информацию.
                
                Вопрос: ${question}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
          topP: 0.8,
          topK: 40
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.error?.message || 'Ошибка при запросе к API');
    }

    const data = await response.json();
    // Extract text from Gemini response structure
    const text = data.candidates[0].content.parts[0].text;
    
    return {
      text: text
    };
  } catch (error) {
    console.error('Error calling AI service:', error);
    // Use fallback response if API call fails
    return getFallbackResponse(question);
  }
};

// Fallback for testing without API
export const getFallbackResponse = (question: string): AIResponse => {
  const lowercaseQuestion = question.toLowerCase();
  
  if (lowercaseQuestion.includes('математика') || lowercaseQuestion.includes('алгебра') || lowercaseQuestion.includes('геометрия')) {
    return {
      text: 'Математика - это наука о структурах, порядке и отношениях, которая исторически развивалась из подсчетов, измерений и описания форм объектов. В современной математике существует множество разделов: алгебра, геометрия, математический анализ, теория чисел, теория вероятностей и другие.'
    };
  }
  
  if (lowercaseQuestion.includes('физика')) {
    return {
      text: 'Физика - это естественная наука, изучающая материю, её движение и поведение в пространстве и времени, а также связанные с этим понятия энергии и силы. Основные разделы физики включают механику, электродинамику, термодинамику, оптику, квантовую физику и теорию относительности.'
    };
  }
  
  if (lowercaseQuestion.includes('ент') || lowercaseQuestion.includes('единое национальное тестирование')) {
    return {
      text: 'Единое национальное тестирование (ЕНТ) - это система оценки знаний выпускников в Казахстане. Тестирование проводится по нескольким предметам, включая обязательные (математика, история Казахстана, грамотность чтения) и профильные, которые выбираются в зависимости от будущей специальности.'
    };
  }
  
  return {
    text: 'Извините, я не могу ответить на этот вопрос. Пожалуйста, задайте вопрос, связанный с образовательными темами, и я постараюсь помочь.'
  };
};
