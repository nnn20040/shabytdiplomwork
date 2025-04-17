
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface EditCourseButtonProps {
  courseId: string;
}

export const EditCourseButton = ({ courseId }: EditCourseButtonProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Проверяем роль пользователя
  if (user?.role !== 'teacher') {
    return null;
  }

  const handleEditCourse = () => {
    navigate(`/course/${courseId}/edit`);
  };

  return (
    <Button onClick={handleEditCourse} variant="outline" className="flex items-center gap-2">
      <Pencil className="h-4 w-4" />
      Редактировать курс
    </Button>
  );
};
