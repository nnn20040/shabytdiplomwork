
import { toast } from 'sonner';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
// Это временное решение, в реальном приложении ключ API должен быть на серверной стороне
// и никогда не должен быть в клиентском коде!
let OPENAI_API_KEY = '';

export const setApiKey = (key: string) => {
  OPENAI_API_KEY = key;
  localStorage.setItem('openai_api_key', key);
  return true;
};

export const getApiKey = () => {
  if (!OPENAI_API_KEY) {
    OPENAI_API_KEY = localStorage.getItem('openai_api_key') || '';
  }
  return OPENAI_API_KEY;
};

export interface AIResponse {
  text: string;
  sources?: { title: string; url: string }[];
}

export const askAI = async (question: string): Promise<AIResponse> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    toast.error('API ключ не настроен. Пожалуйста, добавьте ключ API в настройках.');
    return {
      text: 'Для использования AI-ассистента необходимо добавить API ключ. Пожалуйста, перейдите в настройки и добавьте ключ API.'
    };
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { 
            role: 'system', 
            content: 'Ты образовательный ассистент для сайта Shabyt. Отвечай на вопросы студентов о математике, физике, истории, биологии и другим школьным предметам. Давай четкие, точные и краткие ответы. Используй научный подход и достоверную информацию.' 
          },
          { role: 'user', content: question }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.error?.message || 'Ошибка при запросе к API');
    }

    const data = await response.json();
    return {
      text: data.choices[0].message.content
    };
  } catch (error) {
    console.error('Error calling AI service:', error);
    return {
      text: 'Произошла ошибка при обращении к сервису AI. Пожалуйста, попробуйте позже или проверьте API ключ.'
    };
  }
};

// Fallback для тестирования без API
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
