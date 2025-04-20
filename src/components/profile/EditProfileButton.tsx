
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { UserCog } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const EditProfileButton = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleEditProfile = () => {
    try {
      // Проверка авторизации
      if (!user) {
        toast.error('Необходимо войти в систему');
        return;
      }

      navigate('/profile/edit');
    } catch (error) {
      console.error('Error navigating to profile editing:', error);
      toast.error('Произошла ошибка при переходе к редактированию профиля');
    }
  };

  return (
    <Button onClick={handleEditProfile} variant="outline" className="flex items-center gap-2">
      <UserCog className="h-4 w-4" />
      Редактировать профиль
    </Button>
  );
};
