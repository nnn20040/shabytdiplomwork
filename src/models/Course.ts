
export interface Lesson {
  id: string;
  title: string;
  description: string;
  content?: string;
  video_url?: string;
  completed?: boolean;
  type?: string;
  duration?: string;
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
