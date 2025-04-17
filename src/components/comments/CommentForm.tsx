
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  placeholder?: string;
}

export const CommentForm = ({ onSubmit, placeholder = 'Напишите комментарий...' }: CommentFormProps) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Необходимо войти в систему, чтобы оставить комментарий');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Комментарий не может быть пустым');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(content);
      setContent('');
      toast.success('Комментарий отправлен');
    } catch (error) {
      console.error('Failed to submit comment:', error);
      toast.error('Не удалось отправить комментарий');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={4}
      />
      <Button 
        type="submit" 
        disabled={isSubmitting || !content.trim() || !user} 
        className="flex items-center gap-2"
      >
        <Send className="h-4 w-4" />
        {isSubmitting ? 'Отправка...' : 'Отправить'}
      </Button>
    </form>
  );
};
