import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Book, 
  Users, 
  TestTube, 
  MessageSquare, 
  BarChart, 
  Edit, 
  Plus, 
  Trash2, 
  Eye 
} from 'lucide-react';
import { toast } from 'sonner';
import { CourseDetails, Test, Lesson } from '@/models/Course';

const TeacherCourseManage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/courses/${courseId}`);
        // const data = await response.json();
        
        // Mock data for now
        const mockCourse: CourseDetails = {
          id: Number(courseId),
          title: 'Алгебра: базовый курс',
          description: 'Основы алгебры для школьников старших классов',
          category: 'Математика',
          image: '/placeholder.svg',
          teacher_id: 1,
          teacher_name: 'Александр Петров',
          duration: '8 недель',
          lessons_count: 3,
          featured: true,
          lessons: [
            {
              id: 1,
              title: 'Введение в алгебру',
              description: 'Базовые понятия и определения',
              video_url: 'https://www.youtube.com/embed/jS4aFq5-91M',
              content: 'Содержание урока об основах алгебры...',
              order_index: 1
            },
            {
              id: 2,
              title: 'Линейные уравнения',
              description: 'Решение линейных уравнений',
              video_url: 'https://www.youtube.com/embed/jS4aFq5-91M',
              content: 'Теория и примеры решения линейных уравнений...',
              order_index: 2
            },
            {
              id: 3,
              title: 'Квадратные уравнения',
              description: 'Решение квадратных уравнений',
              video_url: 'https://www.youtube.com/embed/jS4aFq5-91M',
              content: 'Формулы и методы решения квадратных уравнений...',
              order_index: 3
            }
          ],
          tests: [
            {
              id: 1,
              title: 'Тест по линейным уравнениям',
              description: 'Проверка знаний по теме "Линейные уравнения"',
              time_limit: 30,
              passing_score: 70,
              course_id: Number(courseId),
              lesson_id: 2
            }
          ]
        };
        
        setCourse(mockCourse);
      } catch (error) {
        console.error('Failed to fetch course details:', error);
        toast.error('Не удалось загрузить данные курса');
      } finally {
        setLoading(false);
      }
    };
    
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);
  
  const handleDeleteLesson = (lessonId: number) => {
    // In a real app, this would be an API call
    // await fetch(`/api/lessons/${lessonId}`, { method: 'DELETE' });
    
    toast.success('Урок успешно удален');
    // Update local state
    if (course) {
      setCourse({
        ...course,
        lessons: course.lessons.filter(lesson => lesson.id !== lessonId),
        lessons_count: course.lessons_count - 1
      });
    }
  };
  
  const handleDeleteTest = (testId: number) => {
    // In a real app, this would be an API call
    // await fetch(`/api/tests/${testId}`, { method: 'DELETE' });
    
    toast.success('Тест успешно удален');
    // Update local state
    if (course) {
      setCourse({
        ...course,
        tests: course.tests.filter(test => test.id !== testId)
      });
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container">
            <p className="text-center">Загрузка данных курса...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container">
            <p className="text-center">Курс не найден</p>
            <div className="flex justify-center mt-4">
              <Button onClick={() => navigate('/teacher-dashboard')}>
                Вернуться к списку курсов
              </Button>
            </div>
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
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <Button onClick={() => navigate(`/course/${courseId}`)}>
              Просмотр курса
            </Button>
          </div>
          
          <p className="text-muted-foreground mb-8">{course.description}</p>
          
          <Tabs defaultValue="lessons" className="space-y-6">
            <TabsList className="grid grid-cols-5 w-full max-w-3xl">
              <TabsTrigger value="lessons" className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                Уроки
              </TabsTrigger>
              <TabsTrigger value="tests" className="flex items-center gap-2">
                <TestTube className="h-4 w-4" />
                Тесты
              </TabsTrigger>
              <TabsTrigger value="students" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Студенты
              </TabsTrigger>
              <TabsTrigger value="discussions" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Обсуждения
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                Аналитика
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="lessons" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Уроки курса</h2>
                <Button onClick={() => navigate(`/course/${courseId}/lesson/create`)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить урок
                </Button>
              </div>
              
              <Table>
                <TableCaption>Список всех уроков курса.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Название</TableHead>
                    <TableHead>Описание</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {course.lessons.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell>{lesson.order_index}</TableCell>
                      <TableCell className="font-medium">{lesson.title}</TableCell>
                      <TableCell>{lesson.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => navigate(`/course/${courseId}/lesson/${Number(lesson.id)}/edit`)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => navigate(`/course/${courseId}/lesson/${lesson.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteLesson(lesson.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="tests" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Тесты курса</h2>
                <Button onClick={() => navigate(`/course/${courseId}/test/create`)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Создать тест
                </Button>
              </div>
              
              <Table>
                <TableCaption>Список всех тестов курса.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Описание</TableHead>
                    <TableHead>Лимит времени</TableHead>
                    <TableHead>Проходной балл</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {course.tests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium">{test.title}</TableCell>
                      <TableCell>{test.description}</TableCell>
                      <TableCell>{test.time_limit} мин.</TableCell>
                      <TableCell>{test.passing_score}%</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => navigate(`/course/${courseId}/test/${test.id}/edit`)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => navigate(`/course/${courseId}/test/${test.id}/results`)}>
                            <BarChart className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteTest(test.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="students" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Студенты, записанные на курс</h2>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Управление студентами</CardTitle>
                  <CardDescription>Просмотр прогресса и управление доступом студентов к курсу.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Имя</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Прогресс</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Иван Иванов</TableCell>
                        <TableCell>ivan@example.com</TableCell>
                        <TableCell>75%</TableCell>
                        <TableCell><Badge variant="default">Активный</Badge></TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => navigate(`/student/1/progress`)}>
                              Детали
                            </Button>
                            <Button variant="outline" size="sm">
                              Сообщение
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Мария Петрова</TableCell>
                        <TableCell>maria@example.com</TableCell>
                        <TableCell>40%</TableCell>
                        <TableCell><Badge variant="default">Активный</Badge></TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => navigate(`/student/2/progress`)}>
                              Детали
                            </Button>
                            <Button variant="outline" size="sm">
                              Сообщение
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="discussions" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Обсуждения курса</h2>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Вопросы и обсуждения</CardTitle>
                  <CardDescription>Управляйте вопросами и обсуждениями по курсу.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Тема</TableHead>
                        <TableHead>Автор</TableHead>
                        <TableHead>Дата</TableHead>
                        <TableHead>Ответов</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Вопрос по квадратным уравнениям</TableCell>
                        <TableCell>Иван Иванов</TableCell>
                        <TableCell>10.03.2023</TableCell>
                        <TableCell>3</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => navigate(`/course/${courseId}/discussions/1`)}>
                              Просмотреть
                            </Button>
                            <Button variant="outline" size="sm">
                              Ответить
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Проблема с тестом</TableCell>
                        <TableCell>Мария Петрова</TableCell>
                        <TableCell>15.03.2023</TableCell>
                        <TableCell>1</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => navigate(`/course/${courseId}/discussions/2`)}>
                              Просмотреть
                            </Button>
                            <Button variant="outline" size="sm">
                              Ответить
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Аналитика курса</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Статистика по урокам</CardTitle>
                    <CardDescription>Просмотр и завершение уроков</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-center justify-center border rounded">
                      <p className="text-muted-foreground">График будет здесь</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Результаты тестов</CardTitle>
                    <CardDescription>Распределение баллов по тестам</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-center justify-center border rounded">
                      <p className="text-muted-foreground">График будет здесь</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Активность студентов</CardTitle>
                    <CardDescription>Еженедельная активность на курсе</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-center justify-center border rounded">
                      <p className="text-muted-foreground">График будет здесь</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TeacherCourseManage;
