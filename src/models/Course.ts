
export interface Lesson {
  id: string | number;
  title: string;
  description: string;
  content?: string;
  video_url?: string;
  completed?: boolean;
  type?: string;
  duration?: string;
  order_index?: number;
}

export interface Section {
  id: string | number;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string | number;
  title: string;
  description: string;
  instructor?: string;
  instructor_id?: string | number;
  teacher_id?: number;
  teacher_name?: string;
  category: string;
  image: string;
  rating?: number;
  reviews?: number;
  students?: number;
  price?: number;
  lessons_count?: number;
  duration?: string;
  level?: string;
  language?: string;
  lastUpdated?: string;
  features?: string[];
  sections?: Section[];
  featured?: boolean;
  lessons?: Lesson[];
  tests?: any[];
}

export interface CourseDetails extends Course {
  content?: string;
  outcomes?: string[];
  prerequisites?: string[];
  materials?: string[];
  progress?: number;
}

export interface Question {
  id: string | number;
  text?: string;
  question?: string;
  type?: 'radio' | 'checkbox' | 'text';
  options?: string[];
  correctAnswers?: string[] | string;
  correct_answer?: number;
  points: number;
}

export interface Test {
  id: string | number;
  title: string;
  description: string;
  timeLimit: number;
  time_limit?: number;
  questions: Question[];
  passingScore: number;
  passing_score?: number;
  course_id?: number;
  lesson_id?: number;
}

export interface TestResult {
  id: string | number;
  testId: string | number;
  score: number;
  passed: boolean;
  completedAt: string;
  created_at?: string;
  time_spent?: string;
  student_id?: number;
  answers: Array<{
    questionId: string | number;
    userAnswer: string[] | string;
    correct: boolean;
  }>;
}

export interface ForumPost {
  id: string | number;
  title: string;
  content: string;
  author?: string;
  authorId?: string | number;
  authorAvatar?: string;
  courseId?: string | number;
  courseName?: string;
  createdAt?: string;
  created_at?: string;
  replies?: number;
  views?: number;
  solved?: boolean;
  course_id?: number;
  user_id?: number;
  user_name?: string;
  comments_count?: number;
}

export interface ForumComment {
  id: string | number;
  content: string;
  author?: string;
  authorId?: string | number;
  authorAvatar?: string;
  createdAt?: string;
  created_at?: string;
  isAnswer?: boolean;
  post_id?: number;
  user_id?: number;
  user_name?: string;
}
