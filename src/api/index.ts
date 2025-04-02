/**
 * API client for handling requests to backend
 */

// Base API URL - Update this to point to the backend server
const API_URL = process.env.NODE_ENV === 'production' 
  ? '' // In production we use relative URLs
  : 'http://localhost:5000'; // In development we use the full URL with backend port

// Debug API URL
console.log(`API is configured to use: ${API_URL}`);

/**
 * Make API request with proper error handling
 */
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  try {
    const url = `${API_URL}${endpoint}`;
    console.log(`Making request to: ${url}`, options);
    
    // Include auth token if available
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };
    
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
      // Include credentials for cookies
      credentials: 'include',
    });

    console.log(`Received response from ${url}:`, response.status);

    // For non-JSON responses, just return status
    if (response.headers.get('content-type')?.indexOf('application/json') === -1) {
      return { 
        success: response.ok,
        status: response.status,
        message: response.statusText
      };
    }

    // Parse JSON response if available
    let data;
    try {
      data = await response.json();
      console.log(`Response data:`, data);
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      return { 
        success: false, 
        status: response.status,
        message: 'Invalid JSON response'
      };
    }

    // If the response already has a success field, return it directly
    if (data && typeof data.success !== 'undefined') {
      return data;
    }

    // Otherwise, format the response consistently
    return {
      success: response.ok,
      status: response.status,
      ...data
    };
  } catch (error) {
    console.error('API request error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
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
    first_name: string;
    last_name: string;
  }) => {
    try {
      console.log("Отправка данных регистрации:", {
        ...userData,
        password: '***скрыто***'
      });

      const response = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      
      console.log("Ответ регистрации:", response);
      
      // Store auth data in localStorage if successful
      if (response.success && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        sessionStorage.setItem('isLoggedIn', 'true');
      }
      
      return response;
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unexpected error during registration'
      };
    }
  },
  
  // Login user
  login: async (credentials: { email: string; password: string }) => {
    try {
      console.log("Login called with credentials:", credentials);
      
      const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      
      console.log("Login response received:", response);
      
      // Store auth data in localStorage if successful
      if (response.success && response.token) {
        console.log("Storing auth data in localStorage");
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        sessionStorage.setItem('isLoggedIn', 'true');
      } else {
        console.log("Login failed, not storing auth data");
      }
      
      return response;
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error during login'
      };
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
      await apiRequest('/api/auth/logout', {
        method: 'POST'
      });
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Always clean up local storage, even if the API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('isLoggedIn');
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
    console.log("Creating course with data:", courseData);
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
    console.log("Creating lesson with data:", lessonData);
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
