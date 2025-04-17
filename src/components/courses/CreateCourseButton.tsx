
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const CreateCourseButton = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Проверяем роль пользователя
  if (user?.role !== 'teacher') {
    return null;
  }

  const handleCreateCourse = () => {
    navigate('/course/create');
  };

  return (
    <Button onClick={handleCreateCourse} className="flex items-center gap-2">
      <Plus className="h-4 w-4" />
      Создать курс
    </Button>
  );
};
