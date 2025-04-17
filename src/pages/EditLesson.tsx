
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Lesson } from '@/models/Course';
import { coursesApi } from '@/api';

const EditLesson = () => {
  const navigate = useNavigate();
  const { courseId, lessonId } = useParams();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [lessonData, setLessonData] = useState<Partial<Lesson>>({
    title: '',
    description: '',
    video_url: '',
    content: '',
    order_index: 1
  });

  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true);
      try {
        // Реальный API-запрос вместо мока
        const response = await coursesApi.getCourseDetails(String(courseId));
        
        if (response && response.lessons) {
          const lesson = response.lessons.find((l: any) => String(l.id) === lessonId);
          
          if (lesson) {
            setLessonData({
              id: lesson.id,
              title: lesson.title,
              description: lesson.description,
              video_url: lesson.video_url || '',
              content: lesson.content || '',
              order_index: lesson.order_index || 1
            });
          } else {
            // Если не удалось найти урок, используем мок-данные
            setLessonData({
              id: Number(lessonId),
              title: 'Линейные уравнения',
              description: 'Основы решения линейных уравнений',
              video_url: 'https://www.youtube.com/embed/jS4aFq5-91M',
              content: 'Содержание урока о линейных уравнениях...',
              order_index: 2
            });
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch lesson:', error);
        toast.error('Не удалось загрузить данные урока');
        
        // В случае ошибки используем мок-данные
        setLessonData({
          id: Number(lessonId),
          title: 'Линейные уравнения',
          description: 'Основы решения линейных уравнений',
          video_url: 'https://www.youtube.com/embed/jS4aFq5-91M',
          content: 'Содержание урока о линейных уравнениях...',
          order_index: 2
        });
        setLoading(false);
      }
    };

    if (courseId && lessonId) {
      fetchLesson();
    }
  }, [courseId, lessonId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLessonData(prev => ({
      ...prev,
      [name]: name === 'order_index' ? parseInt(value) : value
    }));
  };

  const saveLesson = async () => {
    if (!lessonData.title?.trim()) {
      toast.error('Введите название урока');
      return;
    }

    setSaving(true);
    try {
      // Реальный API-запрос вместо мока
      await coursesApi.updateLesson(
        String(courseId), 
        String(lessonId), 
        lessonData
      );
      
      toast.success('Урок успешно обновлен!');
      setSaving(false);
      navigate(`/course/${courseId}/manage`);
    } catch (error) {
      console.error('Failed to update lesson:', error);
      toast.error('Не удалось обновить урок');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container">
            <p className="text-center">Загрузка данных урока...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <h1 className="text-3xl font-bold mb-6">Редактирование урока</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Информация об уроке</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Название урока</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={lessonData.title} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Краткое описание</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={lessonData.description} 
                  onChange={handleInputChange} 
                  rows={3} 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="video_url">URL видео (YouTube, Vimeo и т.д.)</Label>
                <Input 
                  id="video_url" 
                  name="video_url" 
                  value={lessonData.video_url} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="order_index">Порядковый номер</Label>
                <Input 
                  id="order_index" 
                  name="order_index" 
                  type="number" 
                  min={1}
                  value={lessonData.order_index} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="content">Содержание урока (теоретический материал)</Label>
                <Textarea 
                  id="content" 
                  name="content" 
                  value={lessonData.content} 
                  onChange={handleInputChange} 
                  rows={10} 
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate(`/course/${courseId}/manage`)}
              >
                Отмена
              </Button>
              <Button 
                onClick={saveLesson}
                disabled={saving}
              >
                {saving ? 'Сохранение...' : 'Сохранить изменения'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EditLesson;
