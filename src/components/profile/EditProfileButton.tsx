
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { UserCog } from 'lucide-react';

export const EditProfileButton = () => {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  return (
    <Button onClick={handleEditProfile} variant="outline" className="flex items-center gap-2">
      <UserCog className="h-4 w-4" />
      Редактировать профиль
    </Button>
  );
};
