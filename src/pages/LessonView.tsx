
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { Loader2, ArrowLeft, BookOpen, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface LessonData {
  id: string;
  title: string;
  content: string;
  duration: number;
  course_id: string;
  course_title: string;
  order_index: number;
  total_lessons: number;
  completed: boolean;
}

const fetchLesson = async ({ courseId, lessonId }: { courseId: string; lessonId: string }) => {
  try {
    const { data } = await axios.get(`/api/courses/${courseId}/lessons/${lessonId}`);
    return data.data as LessonData;
  } catch (error) {
    console.error('Error fetching lesson:', error);
    throw new Error('Failed to fetch lesson data');
  }
};

const markLessonCompleted = async (courseId: string, lessonId: string) => {
  try {
    await axios.post(`/api/courses/${courseId}/lessons/${lessonId}/complete`);
    return true;
  } catch (error) {
    console.error('Error marking lesson as completed:', error);
    throw new Error('Failed to mark lesson as completed');
  }
};

const LessonView = () => {
  const { id: courseId, id: lessonId } = useParams<{ id: string; id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('content');
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);

  if (!courseId || !lessonId) {
    return (
      <Layout>
        <div className="container py-8">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-center mb-4">Урок не найден</h1>
          <p className="text-center text-muted-foreground mb-6">
            Запрошенный урок не существует или у вас нет к нему доступа.
          </p>
          <div className="flex justify-center">
            <Button onClick={() => navigate('/courses')}>
              Вернуться к курсам
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const { data: lesson, isLoading, error } = useQuery({
    queryKey: ['lesson', courseId, lessonId],
    queryFn: () => fetchLesson({ courseId, lessonId }),
  });

  const handleMarkComplete = async () => {
    if (isMarkingComplete || !courseId || !lessonId) return;
    
    setIsMarkingComplete(true);
    try {
      await markLessonCompleted(courseId, lessonId);
      toast.success('Урок отмечен как завершенный');
      // Force refetch the lesson data to update the completed status
      window.location.reload();
    } catch (error) {
      toast.error('Не удалось отметить урок как завершенный');
    } finally {
      setIsMarkingComplete(false);
    }
  };

  const handleNextLesson = () => {
    if (!lesson) return;
    
    // Calculate the next lesson's index
    const nextLessonIndex = lesson.order_index + 1;
    
    if (nextLessonIndex <= lesson.total_lessons) {
      navigate(`/course/${courseId}/lesson/${nextLessonIndex}`);
    } else {
      // If this is the last lesson, go back to the course page
      navigate(`/course/${courseId}`);
      toast.success('Поздравляем! Вы завершили все уроки этого курса!');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-16 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Загрузка урока...</span>
        </div>
      </Layout>
    );
  }

  if (error || !lesson) {
    return (
      <Layout>
        <div className="container py-8">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-center mb-4">Ошибка загрузки</h1>
          <p className="text-center text-muted-foreground mb-6">
            Не удалось загрузить данные урока. Пожалуйста, попробуйте позже.
          </p>
          <div className="flex justify-center">
            <Button onClick={() => navigate(-1)}>
              Вернуться назад
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const progress = (lesson.order_index / lesson.total_lessons) * 100;

  return (
    <Layout>
      <div className="container py-8 max-w-5xl">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(`/course/${courseId}`)}
              className="group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Назад к курсу
            </Button>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">{lesson.course_title}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{lesson.title}</h1>
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm">{lesson.duration} мин</span>
              </div>
              <div className="text-sm">
                Урок {lesson.order_index} из {lesson.total_lessons}
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="flex justify-between text-sm mb-2">
              <span>Прогресс курса</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-6">
              <TabsTrigger value="content">Содержание урока</TabsTrigger>
              <TabsTrigger value="materials">Дополнительные материалы</TabsTrigger>
              <TabsTrigger value="notes">Заметки</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content">
              <Card className="p-6">
                <div className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: lesson.content }} />
              </Card>
            </TabsContent>
            
            <TabsContent value="materials">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Дополнительные материалы</h3>
                <p className="text-muted-foreground mb-6">
                  Дополнительные ресурсы для углубленного изучения темы.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start p-3 border rounded-md">
                    <BookOpen className="h-5 w-5 mr-3 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Теоретические основы</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Загрузить PDF с теоретическим материалом по теме
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="notes">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Мои заметки</h3>
                <textarea 
                  className="w-full h-64 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Добавьте свои заметки по уроку здесь..."
                ></textarea>
                <div className="flex justify-end mt-4">
                  <Button variant="outline">Сохранить заметки</Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
            {!lesson.completed ? (
              <Button 
                className="w-full sm:w-auto"
                onClick={handleMarkComplete}
                disabled={isMarkingComplete}
              >
                {isMarkingComplete ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Отметить как завершенное
              </Button>
            ) : (
              <Button variant="outline" className="w-full sm:w-auto" disabled>
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Урок завершен
              </Button>
            )}
            
            <Button 
              variant="default"
              className="w-full sm:w-auto"
              onClick={handleNextLesson}
            >
              {lesson.order_index < lesson.total_lessons ? 'Следующий урок' : 'Завершить курс'}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LessonView;
