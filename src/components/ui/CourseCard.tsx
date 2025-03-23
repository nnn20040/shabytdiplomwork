
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  Star, 
  Users, 
  BookOpen, 
  Play, 
  ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  rating: number;
  students: number;
  lessons: number;
  duration: string;
  image: string;
  featured?: boolean;
}

const CourseCard = ({
  id,
  title,
  description,
  instructor,
  category,
  rating,
  students,
  lessons,
  duration,
  image,
  featured = false,
}: CourseCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`group relative rounded-xl overflow-hidden bg-white dark:bg-gray-900 border border-border/50 transition-all duration-300 ${
        featured ? 'shadow-md' : 'shadow-sm'
      } hover:shadow-lg hover:border-primary/30 animate-hover`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 overflow-hidden">
        {featured && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary text-white text-xs font-medium">
              Популярный курс
            </span>
          </div>
        )}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
          style={{ backgroundImage: `url(${image})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
          <span className="text-white text-sm font-medium bg-black/40 px-2 py-1 rounded-lg backdrop-blur-sm">
            {category}
          </span>
          <div className="flex items-center bg-black/40 px-2 py-1 rounded-lg backdrop-blur-sm">
            <Star className="h-3 w-3 text-yellow-400 mr-1" />
            <span className="text-white text-sm">{rating.toFixed(1)}</span>
          </div>
        </div>
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="bg-primary/90 rounded-full p-3 transform transition-transform duration-300 hover:scale-110">
            <Play className="h-6 w-6 text-white" fill="white" />
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="mb-2">
          <h3 className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <span>Автор: </span>
          <span className="font-medium text-foreground ml-1">{instructor}</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center">
              <BookOpen className="h-3 w-3 mr-1" />
              <span>{lessons} уроков</span>
            </div>
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              <span>{students}</span>
            </div>
          </div>
        </div>
        <Link to={`/course/${id}`}>
          <Button variant="outline" className="w-full group">
            <span className="mr-1">Подробнее</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
