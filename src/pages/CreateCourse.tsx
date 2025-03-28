
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { coursesApi } from '@/api';
import { useLanguage } from '@/contexts/LanguageContext';

const CreateCourse = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [saving, setSaving] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    image: '/placeholder.svg',
    duration: '30 часов',
    featured: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (value: string) => {
    setCourseData(prev => ({
      ...prev,
      category: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileSelected(true);
      // In a real application, you would upload this file to a server
      // and get a URL back. For now, we'll just use a placeholder
      setCourseData(prev => ({
        ...prev,
        image: '/placeholder.svg'
      }));
    }
  };

  const saveCourse = async () => {
    // Validate form
    if (!courseData.title?.trim()) {
      toast.error(t('course.title_required') || 'Введите название курса');
      return;
    }

    if (!courseData.category?.trim()) {
      toast.error(t('course.category_required') || 'Выберите категорию курса');
      return;
    }

    if (!courseData.description?.trim()) {
      toast.error(t('course.description_required') || 'Введите описание курса');
      return;
    }

    setSaving(true);
    try {
      // Send data to API
      const response = await coursesApi.createCourse(courseData);
      
      if (response.success) {
        toast.success(t('course.created') || 'Курс успешно создан!');
        // Navigate to course management
        navigate('/teacher/courses');
      } else {
        throw new Error(response.message || 'Ошибка при создании курса');
      }
    } catch (error) {
      console.error('Failed to save course:', error);
      toast.error(t('course.create_error') || 'Не удалось создать курс');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-4xl py-12">
        <h1 className="text-3xl font-bold mb-6">{t('course.create_new') || 'Создать новый курс'}</h1>
        <p className="text-muted-foreground mb-8">
          {t('course.create_description') || 'Заполните информацию о новом курсе. После создания вы сможете добавить уроки и тесты.'}
        </p>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('course.info') || 'Информация о курсе'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">{t('course.title') || 'Название курса'}</Label>
              <Input 
                id="title" 
                name="title" 
                value={courseData.title} 
                onChange={handleInputChange} 
                placeholder={t('course.title_placeholder') || 'Например: Физика для ЕНТ'} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">{t('course.category') || 'Категория'}</Label>
              <Select 
                value={courseData.category} 
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder={t('course.select_category') || 'Выберите категорию'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Математика">Математика</SelectItem>
                  <SelectItem value="Физика">Физика</SelectItem>
                  <SelectItem value="Химия">Химия</SelectItem>
                  <SelectItem value="Биология">Биология</SelectItem>
                  <SelectItem value="История">История</SelectItem>
                  <SelectItem value="География">География</SelectItem>
                  <SelectItem value="Литература">Литература</SelectItem>
                  <SelectItem value="Английский">Английский язык</SelectItem>
                  <SelectItem value="Информатика">Информатика</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">{t('course.description') || 'Описание курса'}</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={courseData.description} 
                onChange={handleInputChange} 
                placeholder={t('course.description_placeholder') || 'Опишите, о чем ваш курс...'} 
                rows={4} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="image">{t('course.image') || 'Изображение курса'}</Label>
              <Input 
                id="image" 
                name="image" 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              {!fileSelected && (
                <p className="text-sm text-muted-foreground">
                  {t('course.file_not_selected') || 'Файл не выбран'}
                </p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="duration">{t('course.duration') || 'Продолжительность курса'}</Label>
              <Input 
                id="duration" 
                name="duration" 
                value={courseData.duration} 
                onChange={handleInputChange} 
                placeholder="30 часов" 
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => navigate('/teacher/courses')}
            >
              {t('common.cancel') || 'Отмена'}
            </Button>
            <Button 
              onClick={saveCourse}
              disabled={saving}
            >
              {saving ? (t('common.creating') || 'Создание...') : (t('course.create') || 'Создать курс')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateCourse;
