/**
 * API client for handling requests to backend
 */

// Base API URL
const API_URL = '';

/**
 * Make API request with proper error handling
 */
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  try {
    const url = `${API_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    // Parse JSON response if available
    const data = await response.json().catch(() => ({}));

    // If response is not ok, throw error with server message or default
    if (!response.ok) {
      throw new Error(data.message || `Ошибка запроса: ${response.status}`);
    }

    return { data, status: response.status };
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

/**
 * Authentication API calls
 */
export const authApi = {
  // Register a new user
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => {
    // For demonstration purposes, mimicking successful registration
    console.log('Register request:', userData);
    
    // Simulate successful registration
    const mockResponse = {
      success: true,
      token: `mock_token_${Date.now()}`,
      user: {
        id: `user_${Date.now()}`,
        name: userData.name,
        email: userData.email,
        role: userData.role
      }
    };
    
    // Store mock auth data in localStorage
    localStorage.setItem('token', mockResponse.token);
    localStorage.setItem('user', JSON.stringify(mockResponse.user));
    sessionStorage.setItem('isLoggedIn', 'true');
    
    return mockResponse;
  },
  
  // Login user
  login: async (credentials: { email: string; password: string }) => {
    // For demonstration purposes, mimicking successful login
    console.log('Login request:', credentials);
    
    // Simulate successful login
    const mockResponse = {
      success: true,
      token: `mock_token_${Date.now()}`,
      user: {
        id: `user_${Date.now()}`,
        name: 'Test User',
        email: credentials.email,
        role: credentials.email.includes('teacher') ? 'teacher' : 'student'
      }
    };
    
    // Store mock auth data in localStorage
    localStorage.setItem('token', mockResponse.token);
    localStorage.setItem('user', JSON.stringify(mockResponse.user));
    sessionStorage.setItem('isLoggedIn', 'true');
    
    return mockResponse;
  },
  
  // Get current user
  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token) {
      throw new Error('Токен не найден');
    }
    
    return { success: true, user };
  },

  // Logout user
  logout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('isLoggedIn');
    
    return { success: true };
  }
};

/**
 * AI Assistant API calls
 */
export const aiApi = {
  askQuestion: async (question) => {
    try {
      const response = await fetch('/api/ai-assistant/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }
      
      return await response.json();
    } catch (error) {
      console.error('AI API error:', error);
      throw error;
    }
  },
  
  getHistory: async () => {
    try {
      const response = await fetch('/api/ai-assistant/history');
      
      if (!response.ok) {
        throw new Error('Failed to get AI history');
      }
      
      return await response.json();
    } catch (error) {
      console.error('AI history API error:', error);
      throw error;
    }
  }
};

// Helper function to get fallback response for AI assistant
const getFallbackResponse = (question) => {
  const lowercaseQuestion = question.toLowerCase();
  let response = '';
  
  if (lowercaseQuestion.includes('ент')) {
    response = 'ЕНТ (Единое Национальное Тестирование) - это стандартизированный экзамен для выпускников школ в Казахстане. Он используется для поступления в высшие учебные заведения. Основные предметы включают математику, историю Казахстана, грамматику казахского/русского языка и предметы по выбору в зависимости от выбранной специальности.';
  } else if (lowercaseQuestion.includes('математик')) {
    response = 'В математической части ЕНТ тестируются знания по алгебре, геометрии и математическому анализу. Ключевые темы включают функции, уравнения, неравенства, векторы, производные и интегралы. Рекомендую начать с базовых концепций и постепенно переходить к более сложным задачам.';
  } else if (lowercaseQuestion.includes('физик')) {
    response = 'Физика на ЕНТ охватывает механику, термодинамику, электричество и магнетизм, оптику и элементы квантовой физики. Особое внимание уделяется умению решать задачи и применять физические законы. Регулярная практика решения задач - ключ к успеху в этом разделе.';
  } else if (lowercaseQuestion.includes('истори')) {
    response = 'История Казахстана на ЕНТ включает периоды от древности до современности. Важно знать ключевые даты, исторические личности и события. Рекомендую использовать хронологические таблицы и карты для лучшего запоминания материала.';
  } else if (lowercaseQuestion.includes('подготов')) {
    response = 'Для эффективной подготовки к ЕНТ рекомендую: 1) Составить план подготовки по каждому предмету, 2) Регулярно решать тесты в формате ЕНТ, 3) Анализировать свои ошибки, 4) Использовать разнообразные учебные материалы, 5) Поддерживать режим дня и следить за здоровьем. Наша платформа предоставляет все необходимые ресурсы для успешной подготовки.';
  } else if (lowercaseQuestion.includes('химия') || lowercaseQuestion.includes('химич')) {
    response = 'Химия на ЕНТ охватывает основные разделы общей, неорганической и органической химии. Важно знать периодическую таблицу, химические реакции, уметь решать задачи на расчет массы, объема и концентрации веществ. Рекомендую составить краткий справочник с формулами и систематически решать задачи.';
  } else if (lowercaseQuestion.includes('биолог')) {
    response = 'Биология на ЕНТ включает цитологию, ботанику, зоологию, анатомию, генетику и экологию. Особое внимание уделяется терминологии, классификации организмов и пониманию биологических процессов. Используйте мнемонические приемы для запоминания сложных терминов и систематики.';
  } else {
    response = 'Спасибо за ваш вопрос. Могу помочь с информацией по предметам ЕНТ, стратегиям подготовки и различным темам школьной программы. Вы можете задать более конкретный вопрос по интересующей вас теме, и я постараюсь предоставить полезную информацию.';
  }
  
  return {
    success: true,
    data: {
      id: `ai_${Date.now()}`,
      question,
      response,
      created_at: new Date().toISOString()
    }
  };
};

/**
 * Courses API calls
 */
export const coursesApi = {
  // Get all courses
  getCourses: async () => {
    // Mock courses data
    return {
      success: true,
      data: [
        {
          id: 1,
          title: 'Математика для ЕНТ',
          description: 'Полный курс подготовки к ЕНТ по математике',
          category: 'Математика',
          image: '/placeholder.svg',
          teacher_id: 1,
          teacher_name: 'Марат Ахметов',
          duration: '40 часов',
          lessons_count: 24,
          featured: true
        },
        {
          id: 2,
          title: 'Физика для ЕНТ',
          description: 'Основные темы физики для успешной сдачи ЕНТ',
          category: 'Физика',
          image: '/placeholder.svg',
          teacher_id: 2,
          teacher_name: 'Айгуль Сатпаева',
          duration: '35 часов',
          lessons_count: 20,
          featured: true
        },
        {
          id: 3,
          title: 'История Казахстана',
          description: 'Подготовка к ЕНТ по истории Казахстана',
          category: 'История',
          image: '/placeholder.svg',
          teacher_id: 3,
          teacher_name: 'Ержан Нурланов',
          duration: '30 часов',
          lessons_count: 18,
          featured: true
        }
      ]
    };
  },
  
  // Get course details
  getCourseDetails: async (courseId: number) => {
    // Mock course details
    return {
      success: true,
      data: {
        id: courseId,
        title: courseId === 1 ? 'Математика для ЕНТ' : 
               courseId === 2 ? 'Физика для ЕНТ' : 'История Казахстана',
        description: 'Полный курс подготовки к ЕНТ',
        category: courseId === 1 ? 'Математика' : 
                  courseId === 2 ? 'Физика' : 'История',
        image: '/placeholder.svg',
        teacher_id: 1,
        teacher_name: 'Преподаватель',
        duration: '40 часов',
        lessons_count: 24,
        lessons: Array(8).fill(0).map((_, i) => ({
          id: i + 1,
          title: `Урок ${i + 1}: ${courseId === 1 ? 'Алгебра и функции' : 
                   courseId === 2 ? 'Механика и движение' : 'Древний Казахстан'}`,
          description: 'Описание урока',
          video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          content: 'Содержание урока с теоретическим материалом',
          order_index: i + 1
        })),
        tests: Array(4).fill(0).map((_, i) => ({
          id: i + 1,
          title: `Тест ${i + 1}`,
          description: 'Проверьте свои знания по теме',
          time_limit: 30,
          passing_score: 70
        }))
      }
    };
  },
  
  // Create a new lesson
  createLesson: async (courseId: number, lessonData: any) => {
    console.log(`Creating lesson for course ${courseId}:`, lessonData);
    
    // Mock API response
    return {
      success: true,
      data: {
        id: Date.now(),
        course_id: courseId,
        ...lessonData,
        created_at: new Date().toISOString()
      }
    };
  },
  
  // Update a lesson
  updateLesson: async (courseId: number, lessonId: number, lessonData: any) => {
    console.log(`Updating lesson ${lessonId} in course ${courseId}:`, lessonData);
    
    // Mock API response
    return {
      success: true,
      data: {
        id: lessonId,
        course_id: courseId,
        ...lessonData,
        updated_at: new Date().toISOString()
      }
    };
  },
  
  // Delete a lesson
  deleteLesson: async (courseId: number, lessonId: number) => {
    console.log(`Deleting lesson ${lessonId} from course ${courseId}`);
    
    // Mock API response
    return {
      success: true,
      message: 'Урок успешно удален'
    };
  }
};

/**
 * Tests API
 */
export const testsApi = {
  // Create a test
  createTest: async (courseId: number, testData: any) => {
    console.log(`Creating test for course ${courseId}:`, testData);
    
    // Mock API response
    return {
      success: true,
      data: {
        id: Date.now(),
        course_id: courseId,
        ...testData,
        created_at: new Date().toISOString()
      }
    };
  },
  
  // Get test details
  getTest: async (courseId: number, testId: number) => {
    console.log(`Getting test ${testId} for course ${courseId}`);
    
    // Mock test data
    return {
      success: true,
      data: {
        id: testId,
        course_id: courseId,
        title: `Тест ${testId} по курсу`,
        description: 'Проверьте свои знания по материалам курса',
        time_limit: 30,
        passing_score: 70,
        questions: [
          {
            id: 1,
            text: 'Какой метод решения квадратных уравнений использует формулу с дискриминантом?',
            type: 'radio',
            options: [
              { id: 1, text: 'Метод группировки' },
              { id: 2, text: 'Метод выделения полного квадрата' },
              { id: 3, text: 'Формула Виета' },
              { id: 4, text: 'Метод дискриминанта' }
            ],
            correct_option_id: 4
          },
          {
            id: 2,
            text: 'Выберите все верные утверждения о функциях:',
            type: 'checkbox',
            options: [
              { id: 1, text: 'Функция y = x² всегда возрастает' },
              { id: 2, text: 'Линейная функция имеет вид y = kx + b' },
              { id: 3, text: 'Функция y = 1/x определена при x = 0' },
              { id: 4, text: 'Функция y = sin(x) является периодической' }
            ],
            correct_option_ids: [2, 4]
          }
        ]
      }
    };
  },
  
  // Submit test answers
  submitTest: async (courseId: number, testId: number, answers: any) => {
    console.log(`Submitting answers for test ${testId} in course ${courseId}:`, answers);
    
    // Calculate a mock score
    const totalQuestions = Object.keys(answers).length;
    const correctAnswers = Math.floor(Math.random() * (totalQuestions + 1));
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    // Mock API response
    return {
      success: true,
      data: {
        id: Date.now(),
        test_id: testId,
        course_id: courseId,
        user_id: 'current_user',
        score,
        passed: score >= 70,
        answers,
        submitted_at: new Date().toISOString()
      }
    };
  }
};

/**
 * Discussions API
 */
export const discussionsApi = {
  // Get course discussions
  getDiscussions: async (courseId: number) => {
    console.log(`Getting discussions for course ${courseId}`);
    
    // Mock discussions data
    return {
      success: true,
      data: [
        {
          id: 1,
          course_id: courseId,
          title: 'Вопрос по квадратным уравнениям',
          content: 'У меня возникла трудность с решением квадратных уравнений...',
          author_id: 'student1',
          author_name: 'Иван Иванов',
          replies_count: 3,
          created_at: new Date(Date.now() - 5 * 86400000).toISOString() // 5 days ago
        },
        {
          id: 2,
          course_id: courseId,
          title: 'Проблема с тестом',
          content: 'При прохождении теста возникла проблема с вопросом №5...',
          author_id: 'student2',
          author_name: 'Мария Петрова',
          replies_count: 1,
          created_at: new Date(Date.now() - 2 * 86400000).toISOString() // 2 days ago
        }
      ]
    };
  },
  
  // Get discussion details
  getDiscussion: async (courseId: number, discussionId: number) => {
    console.log(`Getting discussion ${discussionId} for course ${courseId}`);
    
    // Mock discussion data
    return {
      success: true,
      data: {
        id: discussionId,
        course_id: courseId,
        title: discussionId === 1 ? 'Вопрос по квадратным уравнениям' : 'Проблема с тестом',
        content: discussionId === 1 
          ? 'У меня возникла трудность с решением квадратных уравнений. Не могу понять, как правильно применять формулу дискриминанта в случаях, когда коэффициент при x² отрицательный. Можете объяснить на примере?'
          : 'При прохождении теста возникла проблема с вопросом №5. Кажется, что в нем нет правильного ответа среди вариантов. Можете проверить?',
        author_id: discussionId === 1 ? 'student1' : 'student2',
        author_name: discussionId === 1 ? 'Иван Иванов' : 'Мария Петрова',
        created_at: new Date(Date.now() - (discussionId === 1 ? 5 : 2) * 86400000).toISOString(),
        replies: discussionId === 1 
          ? [
              {
                id: 1,
                discussion_id: discussionId,
                content: 'Формула дискриминанта D = b² - 4ac работает независимо от знака коэффициента a. Если a отрицательный, это просто влияет на направление ветвей параболы. Пример: -2x² + 4x + 1 = 0. Здесь a = -2, b = 4, c = 1. Находим D = 4² - 4(-2)(1) = 16 + 8 = 24. Далее используем стандартную формулу x = (-b ± √D) / 2a.',
                author_id: 'teacher1',
                author_name: 'Преподаватель',
                is_teacher: true,
                created_at: new Date(Date.now() - 4.5 * 86400000).toISOString()
              },
              {
                id: 2,
                discussion_id: discussionId,
                content: 'Спасибо за объяснение! Так a может быть любым числом, кроме нуля?',
                author_id: 'student1',
                author_name: 'Иван Иванов',
                is_teacher: false,
                created_at: new Date(Date.now() - 4 * 86400000).toISOString()
              },
              {
                id: 3,
                discussion_id: discussionId,
                content: 'Совершенно верно! Если a = 0, то это уже не квадратное уравнение, а линейное (bx + c = 0). Рад, что смог помочь!',
                author_id: 'teacher1',
                author_name: 'Преподаватель',
                is_teacher: true,
                created_at: new Date(Date.now() - 3.5 * 86400000).toISOString()
              }
            ]
          : [
              {
                id: 4,
                discussion_id: discussionId,
                content: 'Спасибо за сообщение! Я проверю тест и исправлю проблему. Вы можете пока пропустить этот вопрос и продолжить тест.',
                author_id: 'teacher1',
                author_name: 'Преподаватель',
                is_teacher: true,
                created_at: new Date(Date.now() - 1.5 * 86400000).toISOString()
              }
            ]
      }
    };
  },
  
  // Create a discussion
  createDiscussion: async (courseId: number, discussionData: any) => {
    console.log(`Creating discussion for course ${courseId}:`, discussionData);
    
    // Mock API response
    return {
      success: true,
      data: {
        id: Date.now(),
        course_id: courseId,
        ...discussionData,
        author_id: 'current_user',
        author_name: 'Текущий пользователь',
        replies_count: 0,
        created_at: new Date().toISOString()
      }
    };
  },
  
  // Reply to a discussion
  replyToDiscussion: async (courseId: number, discussionId: number, content: string) => {
    console.log(`Replying to discussion ${discussionId} in course ${courseId}:`, content);
    
    // Mock API response
    return {
      success: true,
      data: {
        id: Date.now(),
        discussion_id: discussionId,
        content,
        author_id: 'current_user',
        author_name: 'Текущий пользователь',
        is_teacher: false, // Based on current user role
        created_at: new Date().toISOString()
      }
    };
  }
};

/**
 * Analytics API
 */
export const analyticsApi = {
  // Get course analytics
  getCourseAnalytics: async (courseId: number) => {
    console.log(`Getting analytics for course ${courseId}`);
    
    // Mock analytics data
    return {
      success: true,
      data: {
        course_id: courseId,
        students_count: 35,
        completion_rate: 68,
        average_test_score: 75.4,
        lessons_data: [
          { lesson_id: 1, title: 'Урок 1', views: 35, completions: 30 },
          { lesson_id: 2, title: 'Урок 2', views: 32, completions: 28 },
          { lesson_id: 3, title: 'Урок 3', views: 30, completions: 25 },
          { lesson_id: 4, title: 'Урок 4', views: 28, completions: 22 },
          { lesson_id: 5, title: 'Урок 5', views: 25, completions: 18 },
          { lesson_id: 6, title: 'Урок 6', views: 20, completions: 15 },
          { lesson_id: 7, title: 'Урок 7', views: 18, completions: 12 },
          { lesson_id: 8, title: 'Урок 8', views: 15, completions: 10 }
        ],
        tests_data: [
          { test_id: 1, title: 'Тест 1', attempts: 30, average_score: 82 },
          { test_id: 2, title: 'Тест 2', attempts: 25, average_score: 78 },
          { test_id: 3, title: 'Тест 3', attempts: 20, average_score: 72 },
          { test_id: 4, title: 'Тест 4', attempts: 15, average_score: 70 }
        ],
        activity_by_day: [
          { date: '2023-03-01', count: 25 },
          { date: '2023-03-02', count: 30 },
          { date: '2023-03-03', count: 28 },
          { date: '2023-03-04', count: 32 },
          { date: '2023-03-05', count: 35 },
          { date: '2023-03-06', count: 30 },
          { date: '2023-03-07', count: 25 }
        ]
      }
    };
  }
};
