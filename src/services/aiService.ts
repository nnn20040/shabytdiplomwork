
import { toast } from 'sonner';
import { aiApi } from '@/api';

// Removed unused imports
export const setApiKey = (key: string) => {
  localStorage.setItem('ai_api_key_set', 'true');
  return true;
};

export const getApiKey = () => {
  return localStorage.getItem('ai_api_key_set') === 'true' ? 'API_KEY_SET' : '';
};

export interface AIResponse {
  text: string;
  sources?: { title: string; url: string }[];
}

export const askAI = async (question: string): Promise<AIResponse> => {
  try {
    const response = await aiApi.askQuestion(question);
    
    if (response && response.data && response.data.response) {
      return {
        text: response.data.response
      };
    } else {
      return getFallbackResponse(question);
    }
  } catch (error) {
    console.error('Error calling AI service:', error);
    return getFallbackResponse(question);
  }
};

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
