
import { toast } from 'sonner';

interface TestCategory {
  id: string;
  name: string;
}

export interface Test {
  id: string;
  title: string;
  course: string;
  courseId: string;
  questions: number;
  duration: number;
  difficulty: string;
  category: string;
  completed?: boolean;
  score?: number;
  date?: string;
}

// Get all available tests for the logged in user
export const getAvailableTests = async (): Promise<Test[]> => {
  try {
    // Mock data - in production, this would be an API call
    const tests = [
      {
        id: '1',
        title: 'Квадратные уравнения',
        course: 'Математика для ЕНТ',
        courseId: '1',
        questions: 20,
        duration: 30,
        difficulty: 'Средняя',
        category: 'Математика',
        completed: true,
        score: 85,
        date: '15 мая, 2023',
      },
      {
        id: '2',
        title: 'Казахстан в 20 веке',
        course: 'История Казахстана',
        courseId: '3',
        questions: 25,
        duration: 40,
        difficulty: 'Сложная',
        category: 'История',
        completed: true,
        score: 72,
        date: '12 мая, 2023',
      },
      {
        id: '3',
        title: 'Тригонометрические функции',
        course: 'Математика для ЕНТ',
        courseId: '1',
        questions: 15,
        duration: 25,
        difficulty: 'Сложная',
        category: 'Математика',
        completed: true,
        score: 90,
        date: '10 мая, 2023',
      },
      {
        id: '4',
        title: 'Механика: законы Ньютона',
        course: 'Физика: механика и термодинамика',
        courseId: '2',
        questions: 20,
        duration: 30,
        difficulty: 'Средняя',
        category: 'Физика',
        completed: false,
      },
      {
        id: '5',
        title: 'Казахская грамматика',
        course: 'Казахский язык: грамматика и лексика',
        courseId: '4',
        questions: 30,
        duration: 45,
        difficulty: 'Средняя',
        category: 'Казахский язык',
        completed: false,
      },
      {
        id: '6',
        title: 'Органическая химия',
        course: 'Химия для ЕНТ',
        courseId: '5',
        questions: 25,
        duration: 35,
        difficulty: 'Сложная',
        category: 'Химия',
        completed: false,
      },
      {
        id: '7',
        title: 'Клеточная биология',
        course: 'Биология: базовый курс',
        courseId: '6',
        questions: 20,
        duration: 30,
        difficulty: 'Средняя',
        category: 'Биология',
        completed: false,
      },
      {
        id: '8',
        title: 'Английская грамматика',
        course: 'Английский язык для ЕНТ',
        courseId: '7',
        questions: 35,
        duration: 40,
        difficulty: 'Легкая',
        category: 'Английский язык',
        completed: false,
      },
    ];

    return tests;
  } catch (error) {
    console.error('Error fetching tests:', error);
    toast.error('Не удалось загрузить тесты');
    return [];
  }
};

// Get test categories
export const getTestCategories = async (): Promise<TestCategory[]> => {
  try {
    return [
      { id: 'математика', name: 'Математика' },
      { id: 'физика', name: 'Физика' },
      { id: 'история', name: 'История' },
      { id: 'химия', name: 'Химия' },
      { id: 'биология', name: 'Биология' },
      { id: 'казахский язык', name: 'Казахский язык' },
      { id: 'английский язык', name: 'Английский язык' },
    ];
  } catch (error) {
    console.error('Error fetching test categories:', error);
    toast.error('Не удалось загрузить категории тестов');
    return [];
  }
};

// Get detailed test information
export const getTestById = async (testId: string): Promise<any> => {
  try {
    // In production, this would fetch from API
    // Mock response with test details and questions
    return {
      id: testId,
      title: 'Тест по алгебре',
      description: 'Тест по базовым темам алгебры',
      questions: [
        {
          id: 1,
          text: 'Чему равно произведение корней уравнения x² - 5x + 6 = 0?',
          options: ['2', '3', '6', '9'],
          correctAnswer: 2
        },
        {
          id: 2,
          text: 'Найдите значение sinα, если cosα = 0.6',
          options: ['0.6', '0.8', '0.36', '0.64'],
          correctAnswer: 1
        },
        // More questions...
      ]
    };
  } catch (error) {
    console.error(`Error fetching test ${testId}:`, error);
    toast.error('Не удалось загрузить информацию о тесте');
    return null;
  }
};

// Submit test answers
export const submitTestAnswers = async (testId: string, answers: Record<number, number>): Promise<any> => {
  try {
    // Mock API call
    console.log('Submitting answers for test', testId, answers);
    
    // Calculate score (in production this would be done by the backend)
    const numQuestions = Object.keys(answers).length;
    const correctAnswers = Math.floor(Math.random() * (numQuestions + 1));
    const score = Math.round((correctAnswers / numQuestions) * 100);
    
    return {
      testId,
      score,
      passed: score >= 70,
      submittedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error submitting test answers:', error);
    toast.error('Не удалось отправить ответы на тест');
    return null;
  }
};
