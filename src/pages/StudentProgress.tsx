import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BarChart3, Calendar, Flame, BookOpen, MessageCircle, TrendingUp, Clock, ArrowRight, ArrowUpRight } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Badge } from "@/components/ui/badge";

const StudentProgress = () => {
  const { id } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Mock student data
  const [student, setStudent] = useState({
    id: '1',
    name: 'Арман Серікұлы',
    email: 'arman@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    enrolledCourses: 4,
    completedCourses: 1,
    totalLessons: 120,
    completedLessons: 45,
    streak: 7,
    totalStudyTime: '28h 15m',
    averageScore: 76,
    joinDate: '10 января 2023',
  });
  
  // Mock progress data
  const [progressData, setProgressData] = useState({
    dailyActivity: [
      { name: 'Пн', minutes: 45 },
      { name: 'Вт', minutes: 60 },
      { name: 'Ср', minutes: 30 },
      { name: 'Чт', minutes: 90 },
      { name: 'Пт', minutes: 75 },
      { name: 'Сб', minutes: 120 },
      { name: 'Вс', minutes: 60 },
    ],
    weeklyProgress: [
      { week: 'Неделя 1', progress: 10 },
      { week: 'Неделя 2', progress: 25 },
      { week: 'Неделя 3', progress: 40 },
      { week: 'Неделя 4', progress: 52 },
    ],
    subjectDistribution: [
      { name: 'Математика', value: 45 },
      { name: 'История', value: 25 },
      { name: 'Физика', value: 15 },
      { name: 'Казахский язык', value: 15 },
    ],
    testScores: [
      { name: 'Тест 1', score: 65 },
      { name: 'Тест 2', score: 72 },
      { name: 'Тест 3', score: 80 },
      { name: 'Тест 4', score: 85 },
      { name: 'Тест 5', score: 78 },
    ],
  });
  
  // Mock courses data
  const [courses, setCourses] = useState([
    {
      id: '1',
      title: 'Математика для ЕНТ: полный курс',
      progress: 65,
      lastActivity: '2 дня назад',
      lessonsCompleted: 28,
      totalLessons: 42,
    },
    {
      id: '3',
      title: 'История Казахстана: даты и события',
      progress: 40,
      lastActivity: '5 дней назад',
      lessonsCompleted: 14,
      totalLessons: 35,
    },
    {
      id: '2',
      title: 'Физика: механика и термодинамика',
      progress: 20,
      lastActivity: '1 неделю назад',
      lessonsCompleted: 7,
      totalLessons: 38,
    },
    {
      id: '4',
      title: 'Казахский язык: грамматика и лексика',
      progress: 15,
      lastActivity: '2 недели назад',
      lessonsCompleted: 6,
      totalLessons: 40,
    },
  ]);
  
  // Mock recent activities
  const [recentActivities, setRecentActivities] = useState([
    {
      id: '1',
      type: 'lesson',
      course: 'Математика для ЕНТ',
      title: 'Квадратные уравнения',
      date: '2 дня назад',
    },
    {
      id: '2',
      type: 'test',
      course: 'Математика для ЕНТ',
      title: 'Тест: Квадратные уравнения',
      score: 85,
      date: '3 дня назад',
    },
    {
      id: '3',
      type: 'forum',
      title: 'Как решать тригонометрические уравнения?',
      date: '4 дня назад',
    },
    {
      id: '4',
      type: 'lesson',
      course: 'История Казахстана',
      title: 'Казахстан в 20 веке',
      date: '5 дней назад',
    },
    {
      id: '5',
      type: 'test',
      course: 'История Казахстана',
      title: 'Тест: Казахстан в 20 веке',
      score: 72,
      date: '5 дней назад',
    },
  ]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  useEffect(() => {
    // In a real app, you would fetch the student data by ID
    setIsLoaded(true);
  }, [id]);
  
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-32 bg-gray-200 rounded mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="h-40 bg-gray-200 rounded"></div>
                <div className="h-40 bg-gray-200 rounded"></div>
                <div className="h-40 bg-gray-200 rounded"></div>
              </div>
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
      
      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Прогресс ученика</h1>
            
            <div>
              <Button variant="outline">
                <MessageCircle className="h-4 w-4 mr-2" />
                Отправить сообщение
              </Button>
            </div>
          </div>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={student.avatar} />
                    <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h2 className="text-xl font-bold">{student.name}</h2>
                    <p className="text-muted-foreground">{student.email}</p>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Присоединился {student.joinDate}</span>
                    </div>
                  </div>
                </div>
                
                <div className="md:ml-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="font-medium text-2xl">{student.enrolledCourses}</div>
                    <div className="text-sm text-muted-foreground">Курсов</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="font-medium text-2xl">{student.completedLessons}</div>
                    <div className="text-sm text-muted-foreground">Уроков</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="font-medium text-2xl">{student.streak}</div>
                    <div className="text-sm text-muted-foreground">Дней подряд</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="font-medium text-2xl">{student.averageScore}%</div>
                    <div className="text-sm text-muted-foreground">Средний балл</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Общий прогресс</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round((student.completedLessons / student.totalLessons) * 100)}%</div>
                <Progress value={(student.completedLessons / student.totalLessons) * 100} className="h-2 mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {student.completedLessons} из {student.totalLessons} уроков завершено
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Время обучения</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{student.totalStudyTime}</div>
                <Progress value={70} className="h-2 mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  В среднем 1.2 часа в день
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Серия достижений</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{student.streak} дней</div>
                <div className="flex justify-between mt-2">
                  {[...Array(7)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        i < student.streak ? 'bg-primary/20' : 'bg-muted'
                      }`}
                    >
                      <Flame className={`h-4 w-4 ${i < student.streak ? 'text-primary' : 'text-muted-foreground/40'}`} />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Занимается каждый день уже неделю!
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="progress" className="mb-8">
            <TabsList>
              <TabsTrigger value="progress">Прогресс</TabsTrigger>
              <TabsTrigger value="courses">Курсы</TabsTrigger>
              <TabsTrigger value="activity">Активность</TabsTrigger>
            </TabsList>
            
            <TabsContent value="progress" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Ежедневная активность</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={progressData.dailyActivity}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis unit="мин" />
                          <Tooltip formatter={(value) => [`${value} мин`, 'Время']} />
                          <Bar dataKey="minutes" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Прогресс по неделям</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={progressData.weeklyProgress}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="week" />
                          <YAxis unit="%" />
                          <Tooltip formatter={(value) => [`${value}%`, 'Прогресс']} />
                          <Line type="monotone" dataKey="progress" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Распределение по предметам</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={progressData.subjectDistribution}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {progressData.subjectDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}%`, 'Доля времени']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Результаты тестов</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={progressData.testScores}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} unit="%" />
                          <Tooltip formatter={(value) => [`${value}%`, 'Результат']} />
                          <Line type="monotone" dataKey="score" stroke="#82ca9d" activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="courses" className="mt-6">
              <div className="space-y-6">
                {courses.map(course => (
                  <Card key={course.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-semibold mb-2">{course.title}</h3>
                          <div className="flex items-center text-sm text-muted-foreground mb-4">
                            <BookOpen className="h-4 w-4 mr-1" />
                            <span>
                              {course.lessonsCompleted} из {course.totalLessons} уроков пройдено
                            </span>
                          </div>
                          
                          <div className="mb-2">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Прогресс</span>
                              <span>{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>
                          
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Последняя активность: {course.lastActivity}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:items-end gap-2">
                          <Link to={`/course/${course.id}`}>
                            <Button variant="outline" size="sm">
                              Детали курса
                              <ArrowUpRight className="ml-1 h-3 w-3" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="activity" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Недавняя активность</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {recentActivities.map(activity => (
                      <div key={activity.id} className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0">
                        <div className="flex items-start">
                          <div className="bg-primary/10 p-2 rounded-lg mr-3">
                            {activity.type === 'lesson' ? (
                              <BookOpen className="h-5 w-5 text-primary" />
                            ) : activity.type === 'test' ? (
                              <BarChart3 className="h-5 w-5 text-primary" />
                            ) : (
                              <MessageCircle className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium">{activity.title}</h4>
                            {activity.course && (
                              <p className="text-sm text-muted-foreground">{activity.course}</p>
                            )}
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{activity.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {activity.type === 'test' && activity.score && (
                            <div>
                              <div className="font-medium">
                                Результат:
                              </div>
                              <div className={`text-sm ${
                                activity.score >= 80 ? 'text-green-500' : 
                                activity.score >= 60 ? 'text-amber-500' : 
                                'text-red-500'
                              }`}>
                                {activity.score}%
                              </div>
                            </div>
                          )}
                          {activity.type === 'lesson' && (
                            <Badge variant="outline">Завершен</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudentProgress;
