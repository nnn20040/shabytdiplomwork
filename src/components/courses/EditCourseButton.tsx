
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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
    try {
      // Проверка валидности courseId
      if (!courseId) {
        toast.error('Неверный идентификатор курса');
        return;
      }

      // Переход на страницу редактирования курса
      navigate(`/course/${courseId}/edit`);
    } catch (error) {
      console.error('Error navigating to course editing:', error);
      toast.error('Произошла ошибка при переходе к редактированию курса');
    }
  };

  return (
    <Button onClick={handleEditCourse} variant="outline" className="flex items-center gap-2">
      <Pencil className="h-4 w-4" />
      Редактировать курс
    </Button>
  );
};
