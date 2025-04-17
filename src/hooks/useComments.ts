
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface Comment {
  id: string;
  content: string;
  user_id: string;
  user_name?: string;
  created_at: string;
}

export const useComments = (entityId: string, entityType: 'course' | 'lesson' | 'discussion') => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Загрузка комментариев при монтировании компонента
  useEffect(() => {
    if (entityId) {
      fetchComments();
    }
  }, [entityId, entityType]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/${entityType}s/${entityId}/comments`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch comments: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.success && Array.isArray(data.data)) {
        setComments(data.data);
      } else {
        // Если структура ответа не соответствует ожидаемой
        console.warn('Unexpected comments response structure:', data);
        setComments([]);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Не удалось загрузить комментарии');
    } finally {
      setIsLoading(false);
    }
  };

  const addComment = async (content: string) => {
    if (!user) {
      toast.error('Необходимо войти в систему, чтобы оставить комментарий');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/${entityType}s/${entityId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
        credentials: 'include', // Для передачи куки аутентификации
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to add comment');
      }

      const newComment = await response.json();
      
      if (newComment && newComment.success && newComment.data) {
        // Добавляем новый комментарий к списку
        setComments(prev => [...prev, newComment.data]);
        return newComment.data;
      } else {
        throw new Error('Invalid comment data received from server');
      }
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
    refreshComments: fetchComments,
  };
};
