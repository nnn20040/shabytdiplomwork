
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
  time_limit: number;
  passing_score: number;
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
}
