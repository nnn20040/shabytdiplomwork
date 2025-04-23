
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { discussionsApi } from '@/api';

const NewForumTopic = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Введите заголовок обсуждения');
      return;
    }
    
    if (!formData.content.trim()) {
      toast.error('Введите содержание обсуждения');
      return;
    }
    
    if (!formData.category) {
      toast.error('Выберите категорию');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Предполагается, что в API есть метод для создания обсуждения вне контекста курса
      // Можно модифицировать API, чтобы он принимал другой формат или создать новый метод
      const response = await discussionsApi.createDiscussion('general', {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        user_id: user?.id,
      });
      
      if (response.success) {
        toast.success('Тема успешно создана');
        navigate('/forum');
      } else {
        toast.error(response.message || 'Ошибка при создании темы');
      }
    } catch (error) {
      console.error('Error creating forum topic:', error);
      toast.error('Произошла ошибка при создании темы');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link to="/forum" className="inline-flex items-center text-primary hover:underline mb-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Вернуться к форуму
            </Link>
            
            <h1 className="text-3xl font-bold mb-2">Создать новую тему</h1>
            <p className="text-muted-foreground">Поделитесь своим вопросом или начните обсуждение с сообществом</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Информация о теме</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Заголовок
                  </label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Введите заголовок темы"
                    value={formData.title}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Заголовок должен быть ясным и отражать суть вопроса
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Категория
                  </label>
                  <Select value={formData.category} onValueChange={handleSelectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematics">Математика</SelectItem>
                      <SelectItem value="physics">Физика</SelectItem>
                      <SelectItem value="chemistry">Химия</SelectItem>
                      <SelectItem value="biology">Биология</SelectItem>
                      <SelectItem value="history">История Казахстана</SelectItem>
                      <SelectItem value="kazakh">Казахский язык</SelectItem>
                      <SelectItem value="russian">Русский язык</SelectItem>
                      <SelectItem value="english">Английский язык</SelectItem>
                      <SelectItem value="other">Другое</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="content" className="text-sm font-medium">
                    Содержание
                  </label>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Опишите вашу тему или вопрос подробно..."
                    value={formData.content}
                    onChange={handleChange}
                    className="min-h-[200px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Старайтесь предоставить всю необходимую информацию для получения полезных ответов
                  </p>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate('/forum')}
                  >
                    Отмена
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Создание...' : 'Создать тему'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <div className="mt-8 bg-muted/50 p-6 rounded-lg">
            <h3 className="font-medium mb-2">Советы для хорошего обсуждения:</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Делитесь контекстом - расскажите, что вы уже пробовали и что не получилось</li>
              <li>• Будьте конкретны в своих вопросах</li>
              <li>• Уважайте мнение других участников</li>
              <li>• Не публикуйте личную информацию</li>
              <li>• Отмечайте полезные ответы благодарностью</li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NewForumTopic;
