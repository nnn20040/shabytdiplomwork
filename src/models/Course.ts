
/**
 * Course model for frontend usage
 */

export interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  teacher_id: number;
  teacher_name: string;
  duration: string;
  lessons_count: number;
  featured: boolean;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  video_url: string;
  content: string;
  order_index: number;
}

export interface Test {
  id: number;
  title: string;
  description: string;
  time_limit: number; // in minutes
  passing_score: number;
  course_id: number;
  lesson_id?: number; // Optional - can be linked to a specific lesson
  questions?: Question[]; // Questions may be loaded separately
  created_at?: string;
  updated_at?: string;
}

export interface CourseDetails extends Course {
  lessons: Lesson[];
  tests: Test[];
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correct_answer: number;
  points: number;
  test_id?: number;
}

export interface TestResult {
  id: number;
  student_id: number;
  test_id: number;
  score: number;
  answers: { [questionId: number]: number }; // Student's selected answers
  completed: boolean;
  time_spent: number; // in seconds
  created_at: string;
  passed: boolean;
}

export interface StudentProgress {
  id: number;
  student_id: number;
  course_id: number;
  progress: number; // percentage
  completed: boolean;
  last_activity: string;
  lesson_progress?: LessonProgress[];
  test_results?: TestResult[];
}

export interface LessonProgress {
  id: number;
  student_id: number;
  lesson_id: number;
  completed: boolean;
  last_position: number; // video position in seconds
  updated_at: string;
}

export interface ForumPost {
  id: number;
  course_id: number;
  user_id: number;
  user_name: string;
  title: string;
  content: string;
  created_at: string;
  comments_count?: number;
  comments?: ForumComment[];
}

export interface ForumComment {
  id: number;
  post_id: number;
  user_id: number;
  user_name: string;
  content: string;
  created_at: string;
}
