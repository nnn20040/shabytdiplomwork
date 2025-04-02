/**
 * API client for handling requests to backend
 */

// Base API URL - Update this to point to the backend server
const API_URL = process.env.NODE_ENV === 'production' 
  ? '' // В продакшене используем относительные URL
  : 'http://localhost:5000'; // В разработке указываем полный URL с портом бэкенда

/**
 * Make API request with proper error handling
 */
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  try {
    const url = `${API_URL}${endpoint}`;
    console.log(`Making request to: ${url}`, options);
    
    // Включаем headers и CORS настройки без зависимости от токена
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };
    
    // Токен добавляем только если он доступен и только для определенных запросов
    const token = localStorage.getItem('token');
    if (token && endpoint !== '/api/auth/register' && endpoint !== '/api/auth/login') {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
      // Используем 'same-origin' вместо 'include' для локальной разработки
      credentials: 'same-origin',
    });

    console.log(`Received response from ${url}:`, response.status);

    // Для JSON-ответов
    if (response.headers.get('content-type')?.indexOf('application/json') !== -1) {
      const data = await response.json().catch(() => ({}));
      console.log(`Response data:`, data);

      // Если ответ не OK, выбрасываем ошибку с сообщением сервера
      if (!response.ok) {
        throw new Error(data.message || `Ошибка запроса: ${response.status}`);
      }

      return { data, status: response.status };
    } 
    // Для не-JSON ответов
    else {
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Ошибка запроса: ${response.status}`);
      }
      return { status: response.status, data: {} };
    }
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
    const response = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    // Store auth data in localStorage if successful
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      sessionStorage.setItem('isLoggedIn', 'true');
    }
    
    return response.data;
  },
  
  // Login user
  login: async (credentials: { email: string; password: string }) => {
    try {
      console.log("Отправка данных для входа:", credentials.email);
      const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      
      // Store auth data in localStorage if successful
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        sessionStorage.setItem('isLoggedIn', 'true');
      }
      
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },
  
  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await apiRequest('/api/auth/me');
      return response.data;
    } catch (error) {
      // Clear invalid auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('isLoggedIn');
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      // Не отправляем запрос на сервер для logout, просто очищаем localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('isLoggedIn');
    } catch (error) {
      console.error("Error during logout:", error);
    }
    
    return { success: true };
  },
  
  // Forgot password
  forgotPassword: async (email: string) => {
    const response = await apiRequest('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    
    return response.data;
  },
  
  // Reset password
  resetPassword: async (data: { email: string, token: string, newPassword: string }) => {
    const response = await apiRequest('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    return response.data;
  },
  
  // Change password
  changePassword: async (data: { currentPassword: string, newPassword: string }) => {
    const response = await apiRequest('/api/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    
    return response.data;
  },
  
  // Update profile
  updateProfile: async (data: { name: string, email: string }) => {
    const response = await apiRequest('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    
    // Update user data in localStorage
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  }
};

/**
 * AI Assistant API calls
 */
export const aiApi = {
  askQuestion: async (question: string) => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await apiRequest('/api/ai-assistant/ask', {
      method: 'POST',
      headers,
      body: JSON.stringify({ question })
    });
    
    return response.data;
  },
  
  getHistory: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Токен не найден');
    }
    
    const response = await apiRequest('/api/ai-assistant/history', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  }
};

/**
 * Helper function to get fallback response for AI assistant
 * Used when backend connection fails or for testing
 */
export const getFallbackResponse = async (question: string) => {
  try {
    // Try to use the authenticated endpoint if possible
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}/api/ai-assistant/ask`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ question }),
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to get response from API');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting AI response:', error);
    
    // If there's an error, use the anonymous endpoint
    try {
      const anonResponse = await fetch(`${API_URL}/api/ai-assistant/public-ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });
      
      if (anonResponse.ok) {
        return await anonResponse.json();
      }
    } catch (anonError) {
      console.error('Error with anonymous AI request:', anonError);
    }
    
    // If both methods fail, return an error message
    return {
      success: false,
      data: {
        id: `error_${Date.now()}`,
        question,
        response: 'Извините, в данный момент сервер недоступен. Пожа��уйста, попробуйте позже.',
        created_at: new Date().toISOString()
      }
    };
  }
};

/**
 * Courses API calls
 */
export const coursesApi = {
  // Get all courses
  getCourses: async () => {
    const response = await apiRequest('/api/courses');
    return response.data;
  },
  
  // Get featured courses
  getFeaturedCourses: async () => {
    const response = await apiRequest('/api/courses/featured');
    return response.data;
  },
  
  // Get course details
  getCourseDetails: async (courseId: string | number) => {
    const response = await apiRequest(`/api/courses/${courseId}`);
    return response.data;
  },
  
  // Create a new course
  createCourse: async (courseData: any) => {
    const response = await apiRequest('/api/courses', {
      method: 'POST',
      body: JSON.stringify(courseData)
    });
    
    return response.data;
  },
  
  // Update a course
  updateCourse: async (courseId: string | number, courseData: any) => {
    const response = await apiRequest(`/api/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(courseData)
    });
    
    return response.data;
  },
  
  // Delete a course
  deleteCourse: async (courseId: string | number) => {
    const response = await apiRequest(`/api/courses/${courseId}`, {
      method: 'DELETE'
    });
    
    return response.data;
  },
  
  // Create a new lesson
  createLesson: async (courseId: string | number, lessonData: any) => {
    const response = await apiRequest(`/api/courses/${courseId}/lessons`, {
      method: 'POST',
      body: JSON.stringify(lessonData)
    });
    
    return response.data;
  },
  
  // Update a lesson
  updateLesson: async (courseId: string | number, lessonId: string | number, lessonData: any) => {
    const response = await apiRequest(`/api/courses/${courseId}/lessons/${lessonId}`, {
      method: 'PUT',
      body: JSON.stringify(lessonData)
    });
    
    return response.data;
  },
  
  // Delete a lesson
  deleteLesson: async (courseId: string | number, lessonId: string | number) => {
    const response = await apiRequest(`/api/courses/${courseId}/lessons/${lessonId}`, {
      method: 'DELETE'
    });
    
    return response.data;
  },
  
  // Enroll in a course
  enrollCourse: async (courseId: string | number) => {
    const response = await apiRequest(`/api/courses/${courseId}/enroll`, {
      method: 'POST'
    });
    
    return response.data;
  },
  
  // Get enrolled courses
  getEnrolledCourses: async () => {
    const response = await apiRequest('/api/enrollments');
    
    return response.data;
  }
};

/**
 * Tests API
 */
export const testsApi = {
  // Create a test
  createTest: async (courseId: number | string, testData: any) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Токен не найден');
    }
    
    const response = await apiRequest(`/api/courses/${courseId}/tests`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testData)
    });
    
    return response.data;
  },
  
  // Get test details
  getTest: async (courseId: number | string, testId: number | string) => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await apiRequest(`/api/courses/${courseId}/tests/${testId}`, {
      headers
    });
    
    return response.data;
  },
  
  // Update a test
  updateTest: async (courseId: number | string, testId: number | string, testData: any) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Токен не найден');
    }
    
    const response = await apiRequest(`/api/courses/${courseId}/tests/${testId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testData)
    });
    
    return response.data;
  },
  
  // Delete a test
  deleteTest: async (courseId: number | string, testId: number | string) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Токен не найден');
    }
    
    const response = await apiRequest(`/api/courses/${courseId}/tests/${testId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  },
  
  // Submit test answers
  submitTest: async (courseId: number | string, testId: number | string, answers: any) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Токен не найден');
    }
    
    const response = await apiRequest(`/api/courses/${courseId}/tests/${testId}/submit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ answers })
    });
    
    return response.data;
  },
  
  // Get test results
  getTestResults: async (courseId: number | string, testId: number | string) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Токен не найден');
    }
    
    const response = await apiRequest(`/api/courses/${courseId}/tests/${testId}/results`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  }
};

/**
 * Discussions API
 */
export const discussionsApi = {
  // Get course discussions
  getDiscussions: async (courseId: number | string) => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await apiRequest(`/api/courses/${courseId}/discussions`, {
      headers
    });
    
    return response.data;
  },
  
  // Get discussion details
  getDiscussion: async (courseId: number | string, discussionId: number | string) => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await apiRequest(`/api/courses/${courseId}/discussions/${discussionId}`, {
      headers
    });
    
    return response.data;
  },
  
  // Create a discussion
  createDiscussion: async (courseId: number | string, discussionData: any) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Токен не найден');
    }
    
    const response = await apiRequest(`/api/courses/${courseId}/discussions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(discussionData)
    });
    
    return response.data;
  },
  
  // Reply to a discussion
  replyToDiscussion: async (courseId: number | string, discussionId: number | string, content: string) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Токен не найден');
    }
    
    const response = await apiRequest(`/api/courses/${courseId}/discussions/${discussionId}/replies`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    });
    
    return response.data;
  }
};

/**
 * Analytics API
 */
export const analyticsApi = {
  // Get course analytics
  getCourseAnalytics: async (courseId: number | string) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Токен не найден');
    }
    
    const response = await apiRequest(`/api/courses/${courseId}/analytics`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  },
  
  // Get user progress
  getUserProgress: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Токен не найден');
    }
    
    const response = await apiRequest('/api/user/progress', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  }
};
