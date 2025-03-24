
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const CreateDiscussion = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [submitting, setSubmitting] = useState(false);
  
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    category: 'question'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPostData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (value: string) => {
    setPostData(prev => ({
      ...prev,
      category: value
    }));
  };

  const handleSubmit = async () => {
    if (!postData.title.trim()) {
      toast.error('Пожалуйста, введите заголовок');
      return;
    }
    
    if (!postData.content.trim()) {
      toast.error('Пожалуйста, введите содержание');
      return;
    }
    
    setSubmitting(true);
    try {
      // Mock API call
      setTimeout(() => {
        toast.success('Обсуждение успешно создано!');
        setSubmitting(false);
        navigate(`/course/${courseId}/discussions`);
      }, 1000);
    } catch (error) {
      console.error('Failed to create discussion:', error);
      toast.error('Не удалось создать обсуждение');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container max-w-2xl">
          <h1 className="text-3xl font-bold mb-6">Создать новое обсуждение</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Новая тема</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Категория</Label>
                <Select 
                  value={postData.category} 
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="question">Вопрос</SelectItem>
                    <SelectItem value="discussion">Обсуждение</SelectItem>
                    <SelectItem value="suggestion">Предложение</SelectItem>
                    <SelectItem value="feedback">Отзыв</SelectItem>
                    <SelectItem value="problem">Проблема</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="title">Заголовок</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={postData.title} 
                  onChange={handleInputChange} 
                  placeholder="Краткий и понятный заголовок" 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="content">Содержание</Label>
                <Textarea 
                  id="content" 
                  name="content" 
                  value={postData.content} 
                  onChange={handleInputChange} 
                  placeholder="Опишите свой вопрос или тему для обсуждения подробно" 
                  rows={10} 
                />
              </div>
              
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <h3 className="font-medium">Рекомендации по написанию</h3>
                <ul className="text-sm list-disc pl-5 space-y-1">
                  <li>Используйте четкий и информативный заголовок</li>
                  <li>Подробно опишите проблему или вопрос</li>
                  <li>Добавьте информацию о том, что вы уже пробовали сделать</li>
                  <li>Будьте вежливы и уважайте других участников</li>
                  <li>Используйте форматирование для лучшей читаемости</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => navigate(`/course/${courseId}/discussions`)}
              >
                Отмена
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Создание...' : 'Создать обсуждение'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateDiscussion;
