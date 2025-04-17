
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const CreateCourseButton = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Проверяем роль пользователя
  if (user?.role !== 'teacher') {
    return null;
  }

  const handleCreateCourse = () => {
    try {
      // Проверка авторизации перед переходом
      if (!user || !user.id) {
        toast.error('Необходимо авторизоваться');
        return;
      }

      // Переход на страницу создания курса
      navigate('/course/create');
    } catch (error) {
      console.error('Error navigating to course creation:', error);
      toast.error('Произошла ошибка при переходе к созданию курса');
    }
  };

  return (
    <Button onClick={handleCreateCourse} className="flex items-center gap-2">
      <Plus className="h-4 w-4" />
      Создать курс
    </Button>
  );
};
