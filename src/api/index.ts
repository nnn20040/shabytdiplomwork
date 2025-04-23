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
  const url = `${API_URL}${endpoint}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  // Add auth token if available
  try {
    const user = localStorage.getItem('user');
    if (user) {
      const { token } = JSON.parse(user);
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (err) {
    console.warn('Failed to parse user from localStorage', err);
  }

  const fetchOptions: RequestInit = {
    method: options.method || 'GET',
    headers,
    credentials: 'include',
    body: options.body ? options.body : undefined,
  };

  console.log("Making request to:", url);
  if (fetchOptions.body) console.log("Request body:", fetchOptions.body);

  try {
    const response = await fetch(url, fetchOptions);

    const contentType = response.headers.get('content-type');
    const isJSON = contentType?.includes('application/json');

    if (!response.ok) {
      const errorData = isJSON ? await response.json() : { message: response.statusText };
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    return isJSON ? await response.json() : { status: response.status };
  } catch (err) {
    console.error("API request failed:", err);
    throw err;
  }
}


/**
 * Authentication API calls
 */
export const authApi = {
  // Register a new user
  register: async (userData: any) => {
    try {
      console.log("Registering user with data:", {
        ...userData,
        password: "****" // Hide password in logs
      });

      const response = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });

      if (response.data && response.data.user && response.data.data) {
        const userToStore = {
          ...response.data.user,
          token: response.data.data
        };
        localStorage.setItem('user', JSON.stringify(userToStore));
      }

      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  // Login user
  login: async (credentials: { email: string; password: string }) => {
    try {
      console.log("Logging in user:", { email: credentials.email, password: "****" });

      const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });

      if (response.data && response.data.user && response.data.data) {
        // Store user data and token in localStorage
        const userToStore = {
          ...response.data.user,
          token: response.data.data
        };
        localStorage.setItem('user', JSON.stringify(userToStore));
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
      const response = await apiRequest('/api/auth/me', {
        method: 'GET'
      });
      return response.data;
    } catch (error) {
      console.error("Get current user error:", error);
      localStorage.removeItem('user'); // Clear invalid user data
      return { success: false, message: 'Error getting current user' };
    }
  },

  // Logout user
  logout: async () => {
    try {
      console.log("Logging out user");
      // Make logout request to backend
      await apiRequest('/api/auth/logout', {
        method: 'POST'
      });
      // Remove from localStorage
      localStorage.removeItem('user');
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      console.error("Error during logout:", error);
      // Always clean up local storage
      localStorage.removeItem('user');
      return { success: false, message: 'Error during logout' };
    }
  },

  // Remaining methods simplified to just return success
  forgotPassword: async (email: string) => {
    console.log("Requesting password reset for:", email);
    const response = await apiRequest('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    return response.data;
  },

  resetPassword: async (resetData: { email: string; token: string; newPassword: string }) => {
    console.log("Resetting password for:", resetData.email);
    const response = await apiRequest('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(resetData)
    });
    return response.data;
  },

  updateProfile: async (userData: { name: string; email: string }) => {
    console.log("Updating profile:", userData);
    const response = await apiRequest('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });

    if (response.data && response.data.success) {
      // Update user in localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const updatedUser = { ...user, ...userData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    }

    return response.data;
  },

  changePassword: async (passwordData: { currentPassword: string; newPassword: string }) => {
    console.log("Changing password");
    const response = await apiRequest('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData)
    });
    return response.data;
  },
};

/**
 * AI Assistant API calls
 */
export const aiApi = {
  askQuestion: async (question: string) => {
    console.log("Asking AI question:", question);
    try {
      const response = await apiRequest('/api/ai-assistant/public-ask', {
        method: 'POST',
        body: JSON.stringify({ question })
      });

      return response.data;
    } catch (error) {
      console.error("Error asking AI:", error);
      return getFallbackResponse(question);
    }
  },

  getHistory: async () => {
    console.log("Getting AI history");
    try {
      const response = await apiRequest('/api/ai-assistant/history');
      return response.data;
    } catch (error) {
      console.error("Error getting AI history:", error);
      return { success: false, data: [] };
    }
  }
};

/**
 * Helper function to get fallback response for AI assistant
 * Used when backend connection fails or for testing
 */
export const getFallbackResponse = async (question: string) => {
  const lowercaseQuestion = question.toLowerCase();
  console.log("Using fallback response for:", question);

  if (lowercaseQuestion.includes('математика') || lowercaseQuestion.includes('алгебра') || lowercaseQuestion.includes('геометрия')) {
    return {
      success: true,
      data: {
        id: `fallback_${Date.now()}`,
        question,
        response: 'Математика - это наука о структурах, порядке и отношениях, которая исторически развивалась из подсчетов, измерений и описания форм объектов. В современной математике существует множество разделов: алгебра, геометрия, математический анализ, теория чисел, теория вероятностей и другие.',
        created_at: new Date().toISOString()
      }
    };
  }

  if (lowercaseQuestion.includes('физика')) {
    return {
      success: true,
      data: {
        id: `fallback_${Date.now()}`,
        question,
        response: 'Физика - это естественная наука, изучающая материю, её движение и поведение в пространстве и времени, а также связанные с этим понятия энергии и силы. Основные разделы физики включают механику, электродинамику, термодинамику, оптику, квантовую физику и теорию относительности.',
        created_at: new Date().toISOString()
      }
    };
  }

  if (lowercaseQuestion.includes('ент') || lowercaseQuestion.includes('единое национальное тестирование')) {
    return {
      success: true,
      data: {
        id: `fallback_${Date.now()}`,
        question,
        response: 'Единое национальное тестирование (ЕНТ) - это система оценки знаний выпускников в Казахстане. Тестирование проводится по нескольким предметам, включая обязательные (математика, история Казахстана, грамотность чтения) и профильные, которые выбираются в зависимости от будущей специальности.',
        created_at: new Date().toISOString()
      }
    };
  }

  return {
    success: true,
    data: {
      id: `fallback_${Date.now()}`,
      question,
      response: 'Извините, я не могу ответить на этот вопрос. Пожалуйста, задайте вопрос, связанный с образовательными темами, и я постараюсь помочь.',
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
    const response = await apiRequest(`/api/courses/${courseId}/tests`, {
      method: 'POST',
      body: JSON.stringify(testData)
    });

    return response.data;
  },

  // Get test details
  getTest: async (courseId: number | string, testId: number | string) => {
    const response = await apiRequest(`/api/courses/${courseId}/tests/${testId}`);
    return response.data;
  },

  // Update a test
  updateTest: async (courseId: number | string, testId: number | string, testData: any) => {
    const response = await apiRequest(`/api/courses/${courseId}/tests/${testId}`, {
      method: 'PUT',
      body: JSON.stringify(testData)
    });

    return response.data;
  },

  // Delete a test
  deleteTest: async (courseId: number | string, testId: number | string) => {
    const response = await apiRequest(`/api/courses/${courseId}/tests/${testId}`, {
      method: 'DELETE'
    });

    return response.data;
  },

  // Submit test answers
  submitTest: async (courseId: number | string, testId: number | string, answers: any) => {
    const response = await apiRequest(`/api/courses/${courseId}/tests/${testId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers })
    });

    return response.data;
  },

  // Get test results
  getTestResults: async (courseId: number | string, testId: number | string) => {
    const response = await apiRequest(`/api/courses/${courseId}/tests/${testId}/results`);
    return response.data;
  }
};

/**
 * Discussions API
 */
export const discussionsApi = {
  getDiscussions: async (courseId: number | string) => {
    const response = await apiRequest(`/api/courses/${courseId}/discussions`);
    return response.data;
  },
  getDiscussion: async (courseId: number | string, discussionId: number | string) => {
    const response = await apiRequest(`/api/courses/${courseId}/discussions/${discussionId}`);
    return response.data;
  },
  createDiscussion: async (courseId: number | string, discussionData: any) => {
    const response = await apiRequest(`/api/courses/${courseId}/discussions`, {
      method: 'POST',
      body: JSON.stringify(discussionData)
    });
    return response.data;
  },
  replyToDiscussion: async (courseId: number | string, discussionId: number | string, content: string) => {
    const response = await apiRequest(`/api/courses/${courseId}/discussions/${discussionId}/replies`, {
      method: 'POST',
      body: JSON.stringify({ content })
    });
    return response.data;
  }
};

/**
 * Analytics API
 */
export const analyticsApi = {
  getCourseAnalytics: async (courseId: number | string) => {
    const response = await apiRequest(`/api/courses/${courseId}/analytics`);
    return response.data;
  },
  getUserProgress: async () => {
    const response = await apiRequest('/api/user/progress');
    return response.data;
  }
};
