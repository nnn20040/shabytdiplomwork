
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Lesson } from '@/models/Course';
import { useLanguage } from '@/contexts/LanguageContext';
import { coursesApi } from '@/api';

const CreateLesson = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { t } = useLanguage();
  const [saving, setSaving] = useState(false);
  
  const [lessonData, setLessonData] = useState<Partial<Lesson>>({
    title: '',
    description: '',
    video_url: '',
    content: '',
    order_index: 1
  });

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
      // Convert courseId to number since the API expects a number
      const courseIdNumber = courseId ? parseInt(courseId, 10) : 0;
      
      // Call the API to create the lesson
      console.log('Creating lesson for course ID:', courseIdNumber, 'with data:', lessonData);
      await coursesApi.createLesson(courseIdNumber, lessonData);
      toast.success('Урок успешно создан!');
      navigate(`/course/${courseId}/manage`);
    } catch (error) {
      console.error('Failed to save lesson:', error);
      toast.error(error instanceof Error ? error.message : 'Не удалось сохранить урок');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-4xl py-12">
        <h1 className="text-3xl font-bold mb-6">{t('lesson.create') || 'Создание урока'}</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('lesson.info') || 'Информация об уроке'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">{t('lesson.title') || 'Название урока'}</Label>
              <Input 
                id="title" 
                name="title" 
                value={lessonData.title} 
                onChange={handleInputChange} 
                placeholder={t('lesson.title_placeholder') || 'Например: Введение в линейные уравнения'} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">{t('lesson.description') || 'Краткое описание'}</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={lessonData.description} 
                onChange={handleInputChange} 
                placeholder={t('lesson.description_placeholder') || 'Краткое описание содержания урока'} 
                rows={3} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="video_url">{t('lesson.video_url') || 'URL видео (YouTube, Vimeo и т.д.)'}</Label>
              <Input 
                id="video_url" 
                name="video_url" 
                value={lessonData.video_url} 
                onChange={handleInputChange} 
                placeholder="https://www.youtube.com/embed/..." 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="order_index">{t('lesson.order') || 'Порядковый номер'}</Label>
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
              <Label htmlFor="content">{t('lesson.content') || 'Содержание урока (теоретический материал)'}</Label>
              <Textarea 
                id="content" 
                name="content" 
                value={lessonData.content} 
                onChange={handleInputChange} 
                placeholder={t('lesson.content_placeholder') || 'Полное содержание урока, включая теорию, формулы, примеры...'} 
                rows={10} 
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/course/${courseId}/manage`)}
            >
              {t('common.cancel') || 'Отмена'}
            </Button>
            <Button 
              onClick={saveLesson}
              disabled={saving}
            >
              {saving ? (t('common.saving') || 'Сохранение...') : (t('common.save') || 'Сохранить урок')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateLesson;
