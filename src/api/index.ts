
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
};

/**
 * AI Assistant API calls
 */
export const aiApi = {
  // Ask a question to AI assistant
  askQuestion: async (question: string) => {
    // For demonstration, we'll implement a client-side AI response generator
    console.log('AI question:', question);
    
    // Check if it's a math expression
    if (/^[\d\s+\-*/().]+$/.test(question.trim())) {
      try {
        // Basic sanitization
        const sanitized = question.replace(/[^0-9+\-*/(). ]/g, '');
        // Use Function constructor to evaluate the expression safely
        const result = new Function(`return ${sanitized}`)();
        return {
          success: true,
          data: {
            id: `ai_${Date.now()}`,
            question,
            response: `${result}`,
            created_at: new Date().toISOString()
          }
        };
      } catch (error) {
        return {
          success: true,
          data: {
            id: `ai_${Date.now()}`,
            question,
            response: 'Не удалось вычислить выражение. Пожалуйста, проверьте синтаксис.',
            created_at: new Date().toISOString()
          }
        };
      }
    }
    
    // Handle different types of questions
    let response = '';
    
    if (question.toLowerCase().includes('ент')) {
      response = 'ЕНТ (Единое Национальное Тестирование) - это стандартизированный экзамен для выпускников школ в Казахстане. Он используется для поступления в высшие учебные заведения. Основные предметы включают математику, историю Казахстана, грамматику казахского/русского языка и предметы по выбору в зависимости от выбранной специальности.';
    } else if (question.toLowerCase().includes('математик')) {
      response = 'В математической части ЕНТ тестируются знания по алгебре, геометрии и математическому анализу. Ключевые темы включают функции, уравнения, неравенства, векторы, производные и интегралы. Рекомендую начать с базовых концепций и постепенно переходить к более сложным задачам.';
    } else if (question.toLowerCase().includes('физик')) {
      response = 'Физика на ЕНТ охватывает механику, термодинамику, электричество и магнетизм, оптику и элементы квантовой физики. Особое внимание уделяется умению решать задачи и применять физические законы. Регулярная практика решения задач - ключ к успеху в этом разделе.';
    } else if (question.toLowerCase().includes('истори')) {
      response = 'История Казахстана на ЕНТ включает периоды от древности до современности. Важно знать ключевые даты, исторические личности и события. Рекомендую использовать хронологические таблицы и карты для лучшего запоминания материала.';
    } else if (question.toLowerCase().includes('подготов')) {
      response = 'Для эффективной подготовки к ЕНТ рекомендую: 1) Составить план подготовки по каждому предмету, 2) Регулярно решать тесты в формате ЕНТ, 3) Анализировать свои ошибки, 4) Использовать разнообразные учебные материалы, 5) Поддерживать режим дня и следить за здоровьем. Наша платформа предоставляет все необходимые ресурсы для успешной подготовки.';
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
  },
  
  // Get AI assistant history
  getHistory: async () => {
    // For demonstration, we'll return an empty array or mock data
    const token = localStorage.getItem('token');
    
    if (!token) {
      return { success: true, data: [] };
    }
    
    // Mock history data
    return {
      success: true,
      data: [
        {
          id: 'hist1',
          question: 'Что такое ЕНТ?',
          response: 'ЕНТ (Единое Национальное Тестирование) - это стандартизированный экзамен для выпускников школ в Казахстане. Он используется для поступления в высшие учебные заведения.',
          created_at: new Date(Date.now() - 86400000).toISOString() // yesterday
        }
      ]
    };
  }
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
  }
};
