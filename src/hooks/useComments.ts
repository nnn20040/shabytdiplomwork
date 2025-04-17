
import { useState } from 'react';
import { toast } from 'sonner';

interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
}

export const useComments = (entityId: string, entityType: 'course' | 'lesson' | 'discussion') => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addComment = async (content: string) => {
    setIsLoading(true);
    try {
      // В будущем здесь будет реальный API-запрос
      const response = await fetch(`/api/${entityType}s/${entityId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const newComment = await response.json();
      setComments(prev => [...prev, newComment]);
      return newComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Не удалось добавить комментарий');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    comments,
    isLoading,
    addComment,
  };
};
