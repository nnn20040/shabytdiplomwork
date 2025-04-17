
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export const CreateForumButton = () => {
  const navigate = useNavigate();

  const handleCreateForum = () => {
    try {
      // Здесь можно добавить проверку аутентификации пользователя
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
