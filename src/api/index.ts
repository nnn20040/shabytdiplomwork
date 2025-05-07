
/**
 * DEMO API client for handling storage in localStorage
 */

// Helper function to work with localStorage collections
const getCollection = (name: string): any[] => {
  const data = localStorage.getItem(name);
  return data ? JSON.parse(data) : [];
};

const saveCollection = (name: string, data: any[]): void => {
  localStorage.setItem(name, JSON.stringify(data));
};

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

      // Always succeed in demo mode
      const user = {
        id: `user_${Date.now()}`,
        name: userData.name || `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        role: userData.role || "student",
        firstName: userData.firstName,
        lastName: userData.lastName,
        createdAt: new Date().toISOString()
      };

      const token = `demo_token_${Date.now()}`;
      const userToStore = { ...user, token };
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(userToStore));
      
      // Save to users collection
      const users = getCollection('users');
      users.push(user);
      saveCollection('users', users);

      return {
        success: true,
        data: {
          message: "Регистрация успешна",
          user: user,
          data: token
        }
      };
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  // Login user
  login: async (credentials: { email: string; password: string }) => {
    try {
      console.log("Logging in user:", { email: credentials.email, password: "****" });

      // Always succeed in demo mode
      // Set role based on email for demo purposes
      const role = credentials.email.includes('teacher') ? 'teacher' : 'student';
      const name = credentials.email.includes('teacher') ? 'Преподаватель Демо' : 'Студент Демо';
      
      const user = {
        id: `user_${Date.now()}`,
        name: name,
        email: credentials.email,
        role: role
      };

      const token = `demo_token_${Date.now()}`;
      const userToStore = { ...user, token };
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(userToStore));

      return {
        success: true,
        data: {
          message: "Вход успешен",
          user: user,
          data: token
        }
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        return { success: false, message: 'Пользователь не авторизован' };
      }
      
      const user = JSON.parse(userData);
      return { success: true, data: { user } };
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
      localStorage.removeItem('user');
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      console.error("Error during logout:", error);
      localStorage.removeItem('user');
      return { success: false, message: 'Error during logout' };
    }
  },

  // Remaining methods simplified to just return success
  forgotPassword: async (email: string) => {
    console.log("Requesting password reset for:", email);
    return { success: true, data: { message: 'Инструкции по восстановлению пароля отправлены на ваш email' } };
  },

  resetPassword: async (resetData: { email: string; token: string; newPassword: string }) => {
    console.log("Resetting password for:", resetData.email);
    return { success: true, data: { message: 'Пароль успешно сброшен' } };
  },

  updateProfile: async (userData: { name: string; email: string }) => {
    console.log("Updating profile:", userData);
    
    // Update user in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const updatedUser = { ...user, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    return { success: true, data: { message: 'Профиль обновлен' } };
  },

  changePassword: async (passwordData: { currentPassword: string; newPassword: string }) => {
    console.log("Changing password");
    return { success: true, data: { message: 'Пароль успешно изменен' } };
  },
};

/**
 * AI Assistant API calls
 */
export const aiApi = {
  askQuestion: async (question: string) => {
    console.log("Asking AI question:", question);
    try {
      return getFallbackResponse(question);
    } catch (error) {
      console.error("Error asking AI:", error);
      return getFallbackResponse(question);
    }
  },

  getHistory: async () => {
    console.log("Getting AI history");
    // Get from localStorage
    const history = localStorage.getItem('ai_history');
    const historyData = history ? JSON.parse(history) : [];
    return { success: true, data: historyData };
  }
};

/**
 * Helper function to get fallback response for AI assistant
 * Used when backend connection fails or for testing
 */
export const getFallbackResponse = async (question: string) => {
  const lowercaseQuestion = question.toLowerCase();
  console.log("Using fallback response for:", question);

  // Create response
  const response = {
    id: `response_${Date.now()}`,
    question,
    response: getResponseForQuestion(lowercaseQuestion),
    created_at: new Date().toISOString()
  };
  
  // Save to history in localStorage
  const history = localStorage.getItem('ai_history');
  let historyData = history ? JSON.parse(history) : [];
  historyData.push(response);
  localStorage.setItem('ai_history', JSON.stringify(historyData));

  return {
    success: true,
    data: response
  };
};

function getResponseForQuestion(question: string) {
  if (question.includes('математика') || question.includes('алгебра') || question.includes('геометрия')) {
    return 'Математика - это наука о структурах, порядке и отношениях, которая исторически развивалась из подсчетов, измерений и описания форм объектов. В современной математике существует множество разделов: алгебра, геометрия, математический анализ, теория чисел, теория вероятностей и другие.';
  }

  if (question.includes('физика')) {
    return 'Физика - это естественная наука, изучающая материю, её движение и поведение в пространстве и времени, а также связанные с этим понятия энергии и силы. Основные разделы физики включают механику, электродинамику, термодинамику, оптику, квантовую физику и теорию относительности.';
  }

  if (question.includes('ент') || question.includes('единое национальное тестирование')) {
    return 'Единое национальное тестирование (ЕНТ) - это система оценки знаний выпускников в Казахстане. Тестирование проводится по нескольким предметам, включая обязательные (математика, история Казахстана, грамотность чтения) и профильные, которые выбираются в зависимости от будущей специальности.';
  }

  return 'Извините, я не могу ответить на этот вопрос. Пожалуйста, задайте вопрос, связанный с образовательными темами, и я постараюсь помочь.';
}

/**
 * Courses API calls
 */
export const coursesApi = {
  // Get all courses
  getCourses: async () => {
    let courses = getCollection('courses');
    if (courses.length === 0) {
      // Initialize with demo courses if empty
      courses = [
        {
          id: 1,
          title: 'Математика для ЕНТ: полный курс',
          description: 'Подготовка по всем разделам математики для успешной сдачи ЕНТ',
          instructor: 'Асанов Болат',
          category: 'Математика',
          rating: 4.9,
          students: 1250,
          lessons: 42,
          duration: '36 часов',
          image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=500&auto=format&fit=crop',
          featured: true,
        },
        {
          id: 2,
          title: 'Физика: механика и термодинамика',
          description: 'Все законы физики с примерами решения задач в формате ЕНТ',
          instructor: 'Сергеева Анна',
          category: 'Физика',
          rating: 4.8,
          students: 840,
          lessons: 38,
          duration: '32 часа',
          image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=500&auto=format&fit=crop',
          featured: false,
        },
        {
          id: 3,
          title: 'История Казахстана: даты и события',
          description: 'Систематизированный курс по истории Казахстана для ЕНТ',
          instructor: 'Муратов Ерлан',
          category: 'История',
          rating: 4.7,
          students: 920,
          lessons: 35,
          duration: '30 часов',
          image: 'https://images.unsplash.com/photo-1593696954577-ab3d39317b97?q=80&w=500&auto=format&fit=crop',
          featured: true,
        },
      ];
      saveCollection('courses', courses);
    }
    return { success: true, data: courses };
  },

  // Get featured courses
  getFeaturedCourses: async () => {
    const courses = getCollection('courses');
    const featured = courses.filter((course: any) => course.featured);
    return { success: true, data: featured.length ? featured : courses.slice(0, 3) };
  },

  // Get course details
  getCourseDetails: async (courseId: string | number) => {
    const courses = getCollection('courses');
    const course = courses.find((c: any) => c.id == courseId);
    
    if (!course) {
      return { success: false, message: 'Course not found' };
    }
    
    // Get lessons for this course
    const allLessons = getCollection('lessons');
    const courseLessons = allLessons.filter((l: any) => l.courseId == courseId);
    
    // Get tests for this course
    const allTests = getCollection('tests');
    const courseTests = allTests.filter((t: any) => t.courseId == courseId);
    
    // Combine everything
    const courseWithDetails = {
      ...course,
      lessons: courseLessons,
      tests: courseTests
    };
    
    return { success: true, data: courseWithDetails };
  },

  // Create a new course
  createCourse: async (courseData: any) => {
    const courses = getCollection('courses');
    
    // Generate unique ID
    const newId = courses.length > 0 ? Math.max(...courses.map((c: any) => c.id)) + 1 : 1;
    
    const newCourse = {
      id: newId,
      title: courseData.title,
      description: courseData.description || 'Описание курса отсутствует',
      instructor: courseData.instructor || 'Неизвестный преподаватель',
      category: courseData.category || 'Общие',
      rating: 0,
      students: 0,
      lessons: 0,
      duration: '0 часов',
      image: courseData.image || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=500&auto=format&fit=crop',
      featured: false,
      createdAt: new Date().toISOString()
    };
    
    courses.push(newCourse);
    saveCollection('courses', courses);

    return { success: true, data: newCourse };
  },

  // Update a course
  updateCourse: async (courseId: string | number, courseData: any) => {
    const courses = getCollection('courses');
    const index = courses.findIndex((c: any) => c.id == courseId);
    
    if (index === -1) {
      return { success: false, message: 'Course not found' };
    }
    
    courses[index] = { ...courses[index], ...courseData };
    saveCollection('courses', courses);

    return { success: true, data: courses[index] };
  },

  // Delete a course
  deleteCourse: async (courseId: string | number) => {
    const courses = getCollection('courses');
    const filtered = courses.filter((c: any) => c.id != courseId);
    
    if (filtered.length === courses.length) {
      return { success: false, message: 'Course not found' };
    }
    
    saveCollection('courses', filtered);
    
    // Also delete related lessons and tests
    const lessons = getCollection('lessons');
    const filteredLessons = lessons.filter((l: any) => l.courseId != courseId);
    saveCollection('lessons', filteredLessons);
    
    const tests = getCollection('tests');
    const filteredTests = tests.filter((t: any) => t.courseId != courseId);
    saveCollection('tests', filteredTests);

    return { success: true, data: { message: 'Course deleted successfully' } };
  },

  // Create a new lesson
  createLesson: async (courseId: string | number, lessonData: any) => {
    const courses = getCollection('courses');
    const courseIndex = courses.findIndex((c: any) => c.id == courseId);
    
    if (courseIndex === -1) {
      return { success: false, message: 'Course not found' };
    }
    
    const lessons = getCollection('lessons');
    
    // Generate unique ID
    const newId = lessons.length > 0 ? Math.max(...lessons.map((l: any) => l.id)) + 1 : 1;
    
    const newLesson = {
      id: newId,
      courseId: Number(courseId),
      title: lessonData.title,
      content: lessonData.content || 'Контент урока',
      duration: lessonData.duration || '30 минут',
      order: lessonData.order || lessons.filter((l: any) => l.courseId == courseId).length + 1,
      createdAt: new Date().toISOString()
    };
    
    lessons.push(newLesson);
    saveCollection('lessons', lessons);
    
    // Update course lesson count
    courses[courseIndex].lessons = lessons.filter((l: any) => l.courseId == courseId).length;
    saveCollection('courses', courses);

    return { success: true, data: newLesson };
  },

  // Update a lesson
  updateLesson: async (courseId: string | number, lessonId: string | number, lessonData: any) => {
    const lessons = getCollection('lessons');
    const index = lessons.findIndex((l: any) => l.id == lessonId && l.courseId == courseId);
    
    if (index === -1) {
      return { success: false, message: 'Lesson not found' };
    }
    
    lessons[index] = { ...lessons[index], ...lessonData };
    saveCollection('lessons', lessons);

    return { success: true, data: lessons[index] };
  },

  // Delete a lesson
  deleteLesson: async (courseId: string | number, lessonId: string | number) => {
    const lessons = getCollection('lessons');
    const filtered = lessons.filter((l: any) => !(l.id == lessonId && l.courseId == courseId));
    
    if (filtered.length === lessons.length) {
      return { success: false, message: 'Lesson not found' };
    }
    
    saveCollection('lessons', filtered);
    
    // Update course lesson count
    const courses = getCollection('courses');
    const courseIndex = courses.findIndex((c: any) => c.id == courseId);
    if (courseIndex !== -1) {
      courses[courseIndex].lessons = filtered.filter((l: any) => l.courseId == courseId).length;
      saveCollection('courses', courses);
    }

    return { success: true, data: { message: 'Lesson deleted successfully' } };
  },

  // Enroll in a course
  enrollCourse: async (courseId: string | number) => {
    const enrollments = getCollection('enrollments');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Check if already enrolled
    const existingEnrollment = enrollments.find((e: any) => 
      e.courseId == courseId && e.userId == user.id
    );
    
    if (existingEnrollment) {
      return { success: false, message: 'Вы уже зачислены на данный курс' };
    }
    
    // Get course info
    const courses = getCollection('courses');
    const course = courses.find((c: any) => c.id == courseId);
    
    if (!course) {
      return { success: false, message: 'Курс не найден' };
    }
    
    // Create enrollment
    const newEnrollment = {
      id: enrollments.length > 0 ? Math.max(...enrollments.map((e: any) => e.id)) + 1 : 1,
      courseId: Number(courseId),
      userId: user.id || 'demo-user',
      title: course.title,
      progress: 0,
      enrolledAt: new Date().toISOString()
    };
    
    enrollments.push(newEnrollment);
    saveCollection('enrollments', enrollments);
    
    // Update course student count
    const courseIndex = courses.findIndex((c: any) => c.id == courseId);
    if (courseIndex !== -1) {
      courses[courseIndex].students = (courses[courseIndex].students || 0) + 1;
      saveCollection('courses', courses);
    }

    return { success: true, data: newEnrollment };
  },

  // Get enrolled courses
  getEnrolledCourses: async () => {
    const enrollments = getCollection('enrollments');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Filter by current user
    const userEnrollments = user.id 
      ? enrollments.filter((e: any) => e.userId === user.id)
      : enrollments;
    
    return { success: true, data: userEnrollments };
  }
};

/**
 * Tests API
 */
export const testsApi = {
  // Create a test
  createTest: async (courseId: number | string, testData: any) => {
    const tests = getCollection('tests');
    
    // Generate unique ID
    const newId = tests.length > 0 ? Math.max(...tests.map((t: any) => t.id)) + 1 : 1;
    
    // Prepare questions with default options if not provided
    const questions = testData.questions || [
      {
        id: 1,
        text: 'Тестовый вопрос 1',
        options: [
          { id: 1, text: 'Вариант 1', isCorrect: true },
          { id: 2, text: 'Вариант 2', isCorrect: false },
          { id: 3, text: 'Вариант 3', isCorrect: false },
          { id: 4, text: 'Вариант 4', isCorrect: false }
        ]
      },
      {
        id: 2,
        text: 'Тестовый вопрос 2',
        options: [
          { id: 1, text: 'Вариант 1', isCorrect: false },
          { id: 2, text: 'Вариант 2', isCorrect: true },
          { id: 3, text: 'Вариант 3', isCorrect: false },
          { id: 4, text: 'Вариант 4', isCorrect: false }
        ]
      }
    ];
    
    const newTest = {
      id: newId,
      courseId: Number(courseId),
      title: testData.title || 'Новый тест',
      description: testData.description || 'Описание теста',
      timeLimit: testData.timeLimit || 30,
      questions: questions,
      createdAt: new Date().toISOString()
    };
    
    tests.push(newTest);
    saveCollection('tests', tests);

    return { success: true, data: newTest };
  },

  // Get test details
  getTest: async (courseId: number | string, testId: number | string) => {
    const tests = getCollection('tests');
    const test = tests.find((t: any) => t.id == testId && t.courseId == courseId);
    
    if (!test) {
      return { success: false, message: 'Test not found' };
    }
    
    return { success: true, data: test };
  },

  // Update a test
  updateTest: async (courseId: number | string, testId: number | string, testData: any) => {
    const tests = getCollection('tests');
    const index = tests.findIndex((t: any) => t.id == testId && t.courseId == courseId);
    
    if (index === -1) {
      return { success: false, message: 'Test not found' };
    }
    
    tests[index] = { ...tests[index], ...testData };
    saveCollection('tests', tests);

    return { success: true, data: tests[index] };
  },

  // Delete a test
  deleteTest: async (courseId: number | string, testId: number | string) => {
    const tests = getCollection('tests');
    const filtered = tests.filter((t: any) => !(t.id == testId && t.courseId == courseId));
    
    if (filtered.length === tests.length) {
      return { success: false, message: 'Test not found' };
    }
    
    saveCollection('tests', filtered);
    
    // Also delete test results
    const testResults = getCollection('testResults');
    const filteredResults = testResults.filter((r: any) => r.testId != testId);
    saveCollection('testResults', filteredResults);

    return { success: true, data: { message: 'Test deleted successfully' } };
  },

  // Submit test answers
  submitTest: async (courseId: number | string, testId: number | string, answers: any) => {
    const tests = getCollection('tests');
    const test = tests.find((t: any) => t.id == testId && t.courseId == courseId);
    
    if (!test) {
      return { success: false, message: 'Test not found' };
    }
    
    // Calculate score (in demo mode, generate a random score between 60-100%)
    const score = Math.floor(Math.random() * 41) + 60;
    
    // Store test result
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const testResults = getCollection('testResults');
    
    const newResult = {
      id: testResults.length > 0 ? Math.max(...testResults.map((r: any) => r.id)) + 1 : 1,
      testId: Number(testId),
      courseId: Number(courseId),
      userId: user.id || 'demo-user',
      score: score,
      answers: answers,
      submittedAt: new Date().toISOString()
    };
    
    testResults.push(newResult);
    saveCollection('testResults', testResults);

    return { 
      success: true, 
      data: {
        score: score,
        total: 100,
        message: `Вы набрали ${score} из 100 баллов!`,
        testResult: newResult
      }
    };
  },

  // Get test results
  getTestResults: async (courseId: number | string, testId: number | string) => {
    const testResults = getCollection('testResults');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Get results for this test by current user
    const userResults = testResults.filter((r: any) => 
      r.testId == testId && r.courseId == courseId && r.userId === (user.id || 'demo-user')
    );
    
    // If no results, return empty array
    if (userResults.length === 0) {
      return { success: true, data: [] };
    }
    
    // Sort by date (newest first)
    userResults.sort((a: any, b: any) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

    return { success: true, data: userResults };
  }
};

/**
 * Discussions API
 */
export const discussionsApi = {
  getDiscussions: async (courseId: number | string) => {
    const discussions = getCollection('discussions');
    const courseDiscussions = discussions.filter((d: any) => d.courseId == courseId);
    
    return { success: true, data: courseDiscussions };
  },
  
  getDiscussion: async (courseId: number | string, discussionId: number | string) => {
    const discussions = getCollection('discussions');
    const discussion = discussions.find((d: any) => d.id == discussionId && d.courseId == courseId);
    
    if (!discussion) {
      return { success: false, message: 'Discussion not found' };
    }
    
    // Get replies
    const replies = getCollection('discussionReplies');
    const discussionReplies = replies.filter((r: any) => r.discussionId == discussionId);
    
    return { 
      success: true, 
      data: {
        ...discussion,
        replies: discussionReplies
      }
    };
  },
  
  createDiscussion: async (courseId: number | string, discussionData: any) => {
    const discussions = getCollection('discussions');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Generate unique ID
    const newId = discussions.length > 0 ? Math.max(...discussions.map((d: any) => d.id)) + 1 : 1;
    
    const newDiscussion = {
      id: newId,
      courseId: Number(courseId),
      userId: user.id || 'demo-user',
      userName: user.name || 'Демо пользователь',
      title: discussionData.title,
      content: discussionData.content,
      createdAt: new Date().toISOString(),
      replyCount: 0
    };
    
    discussions.push(newDiscussion);
    saveCollection('discussions', discussions);

    return { success: true, data: newDiscussion };
  },
  
  replyToDiscussion: async (courseId: number | string, discussionId: number | string, content: string) => {
    const discussions = getCollection('discussions');
    const discussionIndex = discussions.findIndex((d: any) => d.id == discussionId && d.courseId == courseId);
    
    if (discussionIndex === -1) {
      return { success: false, message: 'Discussion not found' };
    }
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const replies = getCollection('discussionReplies');
    
    // Generate unique ID
    const newId = replies.length > 0 ? Math.max(...replies.map((r: any) => r.id)) + 1 : 1;
    
    const newReply = {
      id: newId,
      discussionId: Number(discussionId),
      userId: user.id || 'demo-user',
      userName: user.name || 'Демо пользователь',
      content: content,
      createdAt: new Date().toISOString()
    };
    
    replies.push(newReply);
    saveCollection('discussionReplies', replies);
    
    // Update discussion reply count
    discussions[discussionIndex].replyCount = (discussions[discussionIndex].replyCount || 0) + 1;
    saveCollection('discussions', discussions);

    return { success: true, data: newReply };
  }
};

/**
 * Analytics API
 */
export const analyticsApi = {
  getCourseAnalytics: async (courseId: number | string) => {
    // Generate demo analytics data
    const analyticsData = {
      studentsCount: Math.floor(Math.random() * 100) + 50,
      completionRate: Math.floor(Math.random() * 41) + 60,
      averageScore: Math.floor(Math.random() * 21) + 75,
      lessonViewStats: [
        { lessonId: 1, title: 'Введение в предмет', views: Math.floor(Math.random() * 50) + 30 },
        { lessonId: 2, title: 'Основные концепции', views: Math.floor(Math.random() * 50) + 25 },
        { lessonId: 3, title: 'Практическое применение', views: Math.floor(Math.random() * 50) + 20 }
      ],
      testCompletionStats: [
        { testId: 1, title: 'Входной тест', completions: Math.floor(Math.random() * 50) + 30, averageScore: Math.floor(Math.random() * 21) + 70 },
        { testId: 2, title: 'Промежуточный тест', completions: Math.floor(Math.random() * 40) + 20, averageScore: Math.floor(Math.random() * 21) + 75 }
      ],
      weeklyActivity: [
        { week: 'Неделя 1', activeStudents: Math.floor(Math.random() * 30) + 20 },
        { week: 'Неделя 2', activeStudents: Math.floor(Math.random() * 30) + 25 },
        { week: 'Неделя 3', activeStudents: Math.floor(Math.random() * 30) + 30 },
        { week: 'Неделя 4', activeStudents: Math.floor(Math.random() * 30) + 28 }
      ]
    };

    return { success: true, data: analyticsData };
  },
  
  getUserProgress: async () => {
    // Get enrolled courses
    const enrollments = getCollection('enrollments');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Get test results
    const testResults = getCollection('testResults');
    const userTestResults = testResults.filter((r: any) => r.userId === (user.id || 'demo-user'));
    
    // Generate demo progress data
    const progressData = {
      coursesCompleted: Math.min(enrollments.filter((e: any) => e.progress === 100).length, 2),
      coursesInProgress: enrollments.filter((e: any) => e.progress > 0 && e.progress < 100).length,
      lessonsCompleted: Math.floor(Math.random() * 10) + 10,
      testsCompleted: userTestResults.length,
      averageScore: userTestResults.length > 0 
        ? Math.round(userTestResults.reduce((sum: number, r: any) => sum + r.score, 0) / userTestResults.length) 
        : 85,
      lastActivity: new Date().toISOString(),
      recentCourses: enrollments.slice(0, 3).map((e: any) => ({
        id: e.courseId,
        title: e.title,
        progress: e.progress
      }))
    };

    return { success: true, data: progressData };
  }
};
