
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

export const CreateForumButton = () => {
  const navigate = useNavigate();

  const handleCreateForum = () => {
    navigate('/forum/create');
  };

  return (
    <Button onClick={handleCreateForum} className="flex items-center gap-2">
      <Plus className="h-4 w-4" />
      Создать форум
    </Button>
  );
};
