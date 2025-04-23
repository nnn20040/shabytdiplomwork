
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const CreateForumButton = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleCreateForum = () => {
    try {
      // Проверка аутентификации пользователя
      if (!isAuthenticated || !user) {
        toast.error('Необходимо войти в систему, чтобы создать форум');
        navigate('/login', { state: { from: '/forum/create' } });
        return;
      }
      
      navigate('/forum/create');
    } catch (error) {
      console.error('Error navigating to forum creation:', error);
      toast.error('Произошла ошибка при переходе к созданию форума');
    }
  };

  return (
    <Button onClick={handleCreateForum} className="flex items-center gap-2">
      <Plus className="h-4 w-4" />
      Создать форум
    </Button>
  );
};
