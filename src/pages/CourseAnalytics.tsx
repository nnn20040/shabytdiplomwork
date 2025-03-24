
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  ChevronLeft, 
  Download, 
  Users, 
  BookOpen, 
  TestTube, 
  Clock, 
  Check, 
  Calendar 
} from 'lucide-react';
import { toast } from 'sonner';
import { CourseDetails } from '@/models/Course';

const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#a855f7'];

const CourseAnalytics = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('month');
  
  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        // Mock API call
        setTimeout(() => {
          // Mock course data
          const mockCourse: CourseDetails = {
            id: Number(courseId),
            title: 'Алгебра: базовый курс',
            description: 'Основы алгебры для школьников старших классов',
            category: 'Математика',
            image: '/placeholder.svg',
            teacher_id: 1,
            teacher_name: 'Александр Петров',
            duration: '8 недель',
            lessons_count: 8,
            featured: true,
            lessons: [],
            tests: []
          };
          
          setCourse(mockCourse);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Failed to fetch course data:', error);
        toast.error('Не удалось загрузить данные курса');
        setLoading(false);
      }
    };
    
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  // Mock analytics data
  const studentActivity = [
    { date: '01.03', count: 12 },
    { date: '02.03', count: 15 },
    { date: '03.03', count: 18 },
    { date: '04.03', count: 25 },
    { date: '05.03', count: 22 },
    { date: '06.03', count: 30 },
    { date: '07.03', count: 28 },
    { date: '08.03', count: 20 },
    { date: '09.03', count: 25 },
    { date: '10.03', count: 35 },
    { date: '11.03', count: 42 },
    { date: '12.03', count: 38 },
    { date: '13.03', count: 40 },
    { date: '14.03', count: 45 }
  ];
  
  const lessonCompletion = [
    { name: 'Урок 1', completed: 45, total: 50 },
    { name: 'Урок 2', completed: 42, total: 50 },
    { name: 'Урок 3', completed: 38, total: 50 },
    { name: 'Урок 4', completed: 35, total: 50 },
    { name: 'Урок 5', completed: 32, total: 50 },
    { name: 'Урок 6', completed: 25, total: 50 },
    { name: 'Урок 7', completed: 22, total: 50 },
    { name: 'Урок 8', completed: 18, total: 50 }
  ];
  
  const testScores = [
    { name: 'Тест 1', average: 85 },
    { name: 'Тест 2', average: 78 },
    { name: 'Тест 3', average: 82 },
    { name: 'Тест 4', average: 75 }
  ];
  
  const courseCompletionRate = [
    { name: 'Завершили', value: 28 },
    { name: 'В процессе', value: 12 },
    { name: 'Не начали', value: 10 }
  ];
  
  const studentMilestones = [
    { milestone: '0-25%', students: 8 },
    { milestone: '26-50%', students: 10 },
    { milestone: '51-75%', students: 12 },
    { milestone: '76-99%', students: 10 },
    { milestone: '100%', students: 10 }
  ];

  const exportAnalytics = () => {
    toast.success('Отчет успешно экспортирован');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container">
            <p className="text-center">Загрузка аналитики курса...</p>
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
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                className="mr-4" 
                onClick={() => navigate(`/course/${courseId}/manage`)}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Назад к управлению
              </Button>
              <div>
                <h1 className="text-3xl font-bold">{course.title} - Аналитика</h1>
                <p className="text-muted-foreground">Подробная статистика по прогрессу студентов и эффективности курса</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Период" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Неделя</SelectItem>
                  <SelectItem value="month">Месяц</SelectItem>
                  <SelectItem value="quarter">Квартал</SelectItem>
                  <SelectItem value="year">Год</SelectItem>
                  <SelectItem value="all">Всё время</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={exportAnalytics}>
                <Download className="h-4 w-4 mr-2" />
                Экспорт
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Всего студентов</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-primary mr-2" />
                  <span className="text-2xl font-bold">50</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">+5 за последний месяц</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Средний прогресс</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="text-2xl font-bold">65%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">+8% за последний месяц</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Средний балл тестов</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <TestTube className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-2xl font-bold">78%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">+3% за последний месяц</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Завершили курс</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-2xl font-bold">28</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">56% от всех студентов</p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList>
              <TabsTrigger value="overview">Обзор</TabsTrigger>
              <TabsTrigger value="students">Студенты</TabsTrigger>
              <TabsTrigger value="lessons">Уроки</TabsTrigger>
              <TabsTrigger value="tests">Тесты</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Активность студентов</CardTitle>
                  <CardDescription>Количество активных студентов по дням</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={studentActivity}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="count" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Статус прохождения курса</CardTitle>
                    <CardDescription>Распределение студентов по статусу</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={courseCompletionRate}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {courseCompletionRate.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Прогресс студентов</CardTitle>
                    <CardDescription>Распределение студентов по прогрессу</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={studentMilestones}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="milestone" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="students" fill="#22c55e" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="students" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Топ студенты</CardTitle>
                  <CardDescription>Студенты с наилучшими показателями</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-2 hover:bg-accent rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-medium">
                          ИИ
                        </div>
                        <div>
                          <p className="font-medium">Иван Иванов</p>
                          <p className="text-xs text-muted-foreground">ivan@example.com</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">95%</p>
                        <p className="text-xs text-muted-foreground">Прогресс</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 hover:bg-accent rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-medium">
                          МП
                        </div>
                        <div>
                          <p className="font-medium">Мария Петрова</p>
                          <p className="text-xs text-muted-foreground">maria@example.com</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">92%</p>
                        <p className="text-xs text-muted-foreground">Прогресс</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 hover:bg-accent rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-medium">
                          АС
                        </div>
                        <div>
                          <p className="font-medium">Алексей Смирнов</p>
                          <p className="text-xs text-muted-foreground">alex@example.com</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">88%</p>
                        <p className="text-xs text-muted-foreground">Прогресс</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Время прохождения</CardTitle>
                  <CardDescription>Среднее время, затраченное студентами на уроки</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Среднее время на урок</span>
                      </div>
                      <span className="font-medium">32 мин</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Среднее время на прохождение теста</span>
                      </div>
                      <span className="font-medium">18 мин</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>Общее среднее время на курс</span>
                      </div>
                      <span className="font-medium">6.5 часов</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="lessons" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Завершение уроков</CardTitle>
                  <CardDescription>Соотношение завершивших урок студентов к общему числу</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={lessonCompletion}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="completed" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Наиболее популярные уроки</CardTitle>
                    <CardDescription>Уроки с наибольшим просмотром</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-2 hover:bg-accent rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                            1
                          </div>
                          <div>
                            <p className="font-medium">Урок 1: Введение в алгебру</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Users className="h-3 w-3 mr-1" /> 
                              <span>50 просмотров</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 hover:bg-accent rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                            4
                          </div>
                          <div>
                            <p className="font-medium">Урок 4: Квадратные уравнения</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Users className="h-3 w-3 mr-1" /> 
                              <span>48 просмотров</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 hover:bg-accent rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                            2
                          </div>
                          <div>
                            <p className="font-medium">Урок 2: Линейные уравнения</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Users className="h-3 w-3 mr-1" /> 
                              <span>45 просмотров</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Наименее завершаемые уроки</CardTitle>
                    <CardDescription>Уроки с наименьшим процентом завершения</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-2 hover:bg-accent rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-medium">
                            8
                          </div>
                          <div>
                            <p className="font-medium">Урок 8: Тригонометрия</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Check className="h-3 w-3 mr-1" /> 
                              <span>36% завершения</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 hover:bg-accent rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-medium">
                            7
                          </div>
                          <div>
                            <p className="font-medium">Урок 7: Система неравенств</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Check className="h-3 w-3 mr-1" /> 
                              <span>44% завершения</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 hover:bg-accent rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-medium">
                            6
                          </div>
                          <div>
                            <p className="font-medium">Урок 6: Логарифмы</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Check className="h-3 w-3 mr-1" /> 
                              <span>50% завершения</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="tests" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Средние баллы по тестам</CardTitle>
                  <CardDescription>Средний результат студентов за каждый тест</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={testScores}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="average" fill="#22c55e" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Сложные вопросы</CardTitle>
                    <CardDescription>Вопросы с наименьшим процентом правильных ответов</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 border rounded-lg">
                        <p className="font-medium mb-1">Тест 3, Вопрос 5</p>
                        <p className="text-sm text-muted-foreground mb-2">
                          Решите квадратное уравнение: x² - 9x + 20 = 0
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Правильных ответов:</span>
                          <span className="text-xs font-medium text-red-500">35%</span>
                        </div>
                      </div>
                      
                      <div className="p-3 border rounded-lg">
                        <p className="font-medium mb-1">Тест 2, Вопрос 8</p>
                        <p className="text-sm text-muted-foreground mb-2">
                          Найдите значение выражения: log₂8 + log₄16
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Правильных ответов:</span>
                          <span className="text-xs font-medium text-red-500">42%</span>
                        </div>
                      </div>
                      
                      <div className="p-3 border rounded-lg">
                        <p className="font-medium mb-1">Тест 4, Вопрос 3</p>
                        <p className="text-sm text-muted-foreground mb-2">
                          Вычислите: sin²α + cos²α при α = 45°
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Правильных ответов:</span>
                          <span className="text-xs font-medium text-red-500">48%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Время прохождения тестов</CardTitle>
                    <CardDescription>Среднее время, затраченное на каждый тест</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-2 border-b">
                        <div className="flex items-center gap-2">
                          <TestTube className="h-4 w-4 text-primary" />
                          <span>Тест 1</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                          <span>18:45</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 border-b">
                        <div className="flex items-center gap-2">
                          <TestTube className="h-4 w-4 text-primary" />
                          <span>Тест 2</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                          <span>22:10</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 border-b">
                        <div className="flex items-center gap-2">
                          <TestTube className="h-4 w-4 text-primary" />
                          <span>Тест 3</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                          <span>20:38</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-2">
                        <div className="flex items-center gap-2">
                          <TestTube className="h-4 w-4 text-primary" />
                          <span>Тест 4</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                          <span>15:22</span>
                        </div>
                      </div>
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

export default CourseAnalytics;
