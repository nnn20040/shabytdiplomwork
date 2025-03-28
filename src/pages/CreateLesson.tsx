
import { useState } from 'react';
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

const CreateLesson = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
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
      // Mock API call
      setTimeout(() => {
        toast.success('Урок успешно создан!');
        setSaving(false);
        navigate(`/course/${courseId}/manage`);
      }, 1000);
    } catch (error) {
      console.error('Failed to save lesson:', error);
      toast.error('Не удалось сохранить урок');
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <h1 className="text-3xl font-bold mb-6">Создание урока</h1>
          
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
                  placeholder="Например: Введение в линейные уравнения" 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Краткое описание</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={lessonData.description} 
                  onChange={handleInputChange} 
                  placeholder="Краткое описание содержания урока" 
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
                  placeholder="https://www.youtube.com/embed/..." 
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
                  placeholder="Полное содержание урока, включая теорию, формулы, примеры..." 
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
                {saving ? 'Сохранение...' : 'Сохранить урок'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateLesson;
