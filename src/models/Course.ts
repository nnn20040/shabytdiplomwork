
export interface Lesson {
  id: string;
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
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructor_id?: string;
  category: string;
  image: string;
  rating: number;
  reviews?: number;
  students: number;
  price?: number;
  lessons?: number;
  duration?: string;
  level?: string;
  language?: string;
  lastUpdated?: string;
  features?: string[];
  sections?: Section[];
}

export interface CourseDetails extends Course {
  content: string;
  outcomes: string[];
  prerequisites: string[];
  materials: string[];
  progress?: number;
}

export interface Question {
  id: string;
  text: string;
  type: 'radio' | 'checkbox' | 'text';
  options?: string[];
  correctAnswers?: string[] | string;
  points: number;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  timeLimit: number;
  questions: Question[];
  passingScore: number;
}

export interface TestResult {
  id: string;
  testId: string;
  score: number;
  passed: boolean;
  completedAt: string;
  answers: Array<{
    questionId: string;
    userAnswer: string[] | string;
    correct: boolean;
  }>;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  authorAvatar?: string;
  courseId: string;
  courseName: string;
  createdAt: string;
  replies: number;
  views: number;
  solved: boolean;
}

export interface ForumComment {
  id: string;
  content: string;
  author: string;
  authorId: string;
  authorAvatar?: string;
  createdAt: string;
  isAnswer: boolean;
}
