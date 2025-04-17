
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AddLessonButtonProps {
  courseId: string;
}

export const AddLessonButton = ({ courseId }: AddLessonButtonProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Проверяем роль пользователя
  if (user?.role !== 'teacher') {
    return null;
  }

  const handleAddLesson = () => {
    try {
      // Проверка валидности courseId
      if (!courseId) {
        toast.error('Неверный идентификатор курса');
        return;
      }

      // Переход на страницу создания урока
      navigate(`/course/${courseId}/lesson/create`);
    } catch (error) {
      console.error('Error navigating to lesson creation:', error);
      toast.error('Произошла ошибка при переходе к созданию урока');
    }
  };

  return (
    <Button onClick={handleAddLesson} className="flex items-center gap-2">
      <Plus className="h-4 w-4" />
      Добавить урок
    </Button>
  );
};
