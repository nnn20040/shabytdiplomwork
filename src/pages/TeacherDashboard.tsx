
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  PlusCircle, 
  Users, 
  Video, 
  Clock, 
  ChevronRight, 
  FileText,
  BarChart3,
  MessageCircle,
  Brain,
  Pencil,
  Trash2,
  Search
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const TeacherDashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Mock data for teacher's courses
  const teacherCourses = [
    {
      id: '1',
      title: 'Математика для ЕНТ: полный курс',
      category: 'Математика',
      students: 1250,
      lessons: 42,
      duration: '36 часов',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=500&auto=format&fit=crop',
      status: 'active',
      creation_date: '10.03.2023',
    },
    {
      id: '2',
      title: 'Алгебра: базовый уровень',
      category: 'Математика',
      students: 865,
      lessons: 30,
      duration: '24 часа',
      image: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?q=80&w=500&auto=format&fit=crop',
      status: 'active',
      creation_date: '15.05.2023',
    },
    {
      id: '3',
      title: 'Геометрия: решение задач',
      category: 'Математика',
      students: 720,
      lessons: 26,
      duration: '20 часов',
      image: 'https://images.unsplash.com/photo-1633525909608-8a1ba07a704b?q=80&w=500&auto=format&fit=crop',
      status: 'draft',
      creation_date: '02.08.2023',
    },
  ];

  // Mock data for student progress
  const studentProgress = [
    {
      id: '1',
      name: 'Айдар Нурланов',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      course: 'Математика для ЕНТ',
      progress: 78,
      last_activity: '2 часа назад',
      tests_passed: 12,
      avg_score: 85,
    },
    {
      id: '2',
      name: 'Мадина Кенжебаева',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      course: 'Математика для ЕНТ',
      progress: 92,
      last_activity: 'Вчера',
      tests_passed: 14,
      avg_score: 92,
    },
    {
      id: '3',
      name: 'Арман Сулейменов',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      course: 'Алгебра: базовый уровень',
      progress: 45,
      last_activity: '3 дня назад',
      tests_passed: 8,
      avg_score: 67,
    },
    {
      id: '4',
      name: 'Дана Исмаилова',
      avatar: 'https://randomuser.me/api/portraits/women/67.jpg',
      course: 'Геометрия: решение задач',
      progress: 62,
      last_activity: 'Сегодня',
      tests_passed: 9,
      avg_score: 74,
    },
  ];

  // Mock data for recent student questions
  const studentQuestions = [
    {
      id: '1',
      student: 'Бекжан Касымов',
      avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
      question: 'Как решать системы уравнений методом Крамера?',
      course: 'Математика для ЕНТ',
      date: '2 часа назад',
      status: 'pending',
    },
    {
      id: '2',
      student: 'Алина Сериккызы',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
      question: 'Не могу разобраться с тригонометрическими функциями, можете помочь?',
      course: 'Алгебра: базовый уровень',
      date: 'Вчера',
      status: 'answered',
    },
    {
      id: '3',
      student: 'Тимур Ахметов',
      avatar: 'https://randomuser.me/api/portraits/men/39.jpg',
      question: 'Как применять теорему Пифагора для сложных задач?',
      course: 'Геометрия: решение задач',
      date: '3 дня назад',
      status: 'pending',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-3xl font-bold">Панель учителя</h1>
              <p className="text-muted-foreground mt-1">Управляйте своими курсами и студентами</p>
            </div>
            <div className={`transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex items-center mt-4 md:mt-0">
                <Avatar className="h-10 w-10 border-2 border-primary mr-4">
                  <AvatarImage src="https://randomuser.me/api/portraits/men/41.jpg" />
                  <AvatarFallback>БА</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Болат Асанов</p>
                  <p className="text-sm text-muted-foreground">Учитель математики</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className={`transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Всего курсов</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <div className="flex items-center text-xs text-muted-foreground mt-2">
                  <BookOpen className="h-4 w-4 mr-1" />
                  <span>2 активных, 1 черновик</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className={`transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Всего студентов</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,835</div>
                <div className="flex items-center text-xs text-muted-foreground mt-2">
                  <Users className="h-4 w-4 mr-1" />
                  <span>+125 за последний месяц</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className={`transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Новые вопросы</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <div className="flex items-center text-xs text-muted-foreground mt-2">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  <span>Требуют ответа</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className={`transition-all duration-700 delay-600 mb-8 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Мои курсы</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Создать курс
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Создать новый курс</DialogTitle>
                    <DialogDescription>
                      Заполните информацию о новом курсе. После создания вы сможете добавить уроки и тесты.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Название курса</Label>
                      <Input id="title" placeholder="Например: Физика для ЕНТ" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="category">Категория</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="math">Математика</SelectItem>
                          <SelectItem value="physics">Физика</SelectItem>
                          <SelectItem value="chemistry">Химия</SelectItem>
                          <SelectItem value="biology">Биология</SelectItem>
                          <SelectItem value="history">История</SelectItem>
                          <SelectItem value="geography">География</SelectItem>
                          <SelectItem value="kazakh">Казахский язык</SelectItem>
                          <SelectItem value="russian">Русский язык</SelectItem>
                          <SelectItem value="english">Английский язык</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Описание курса</Label>
                      <Textarea id="description" placeholder="Опишите, о чем ваш курс..." />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="image">Изображение курса</Label>
                      <Input id="image" type="file" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Создать курс</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teacherCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <div className="h-40 relative">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                      <span className="text-white text-sm font-medium bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
                        {course.category}
                      </span>
                      <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
                        {course.status === 'active' ? 'Активный' : 'Черновик'}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{course.students} студентов</span>
                      </div>
                      <div className="flex items-center">
                        <Video className="h-4 w-4 mr-1" />
                        <span>{course.lessons} уроков</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{course.creation_date}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    <Button variant="outline" size="sm">
                      <Pencil className="h-4 w-4 mr-1" />
                      Редактировать
                    </Button>
                    <Link to={`/course/${course.id}/manage`}>
                      <Button size="sm">
                        Управление
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
          
          <div className={`transition-all duration-700 delay-700 mb-8 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Card>
              <CardHeader>
                <CardTitle>Успеваемость студентов</CardTitle>
                <CardDescription>Отслеживайте прогресс ваших студентов по курсам</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input placeholder="Поиск студента..." className="pl-10" />
                </div>
                
                <div className="space-y-4">
                  {studentProgress.map((student) => (
                    <div key={student.id} className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={student.avatar} />
                            <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{student.name}</h4>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <span>{student.course}</span>
                              <span className="mx-2">•</span>
                              <span>Последняя активность: {student.last_activity}</span>
                            </div>
                          </div>
                        </div>
                        <Link to={`/student/${student.id}/progress`}>
                          <Button variant="ghost" size="sm">
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Детали
                          </Button>
                        </Link>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Прогресс по курсу</span>
                          <span className="font-medium">{student.progress}%</span>
                        </div>
                        <Progress value={student.progress} className="h-2" />
                      </div>
                      <div className="flex justify-between mt-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Пройдено тестов:</span>
                          <span className="ml-1 font-medium">{student.tests_passed}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Средний балл:</span>
                          <span className={`ml-1 font-medium ${
                            student.avg_score >= 80 ? 'text-green-500' : 
                            student.avg_score >= 60 ? 'text-amber-500' : 
                            'text-red-500'
                          }`}>
                            {student.avg_score}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Link to="/students">
                    <Button variant="outline">
                      Все студенты
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transition-all duration-700 delay-800 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Card>
              <CardHeader>
                <CardTitle>Вопросы студентов</CardTitle>
                <CardDescription>Ответьте на вопросы ваших студентов</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentQuestions.map((question) => (
                    <div key={question.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarImage src={question.avatar} />
                            <AvatarFallback>{question.student.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-sm">{question.student}</h4>
                            <p className="text-xs text-muted-foreground">{question.course}</p>
                          </div>
                        </div>
                        <Badge variant={question.status === 'pending' ? 'destructive' : 'outline'}>
                          {question.status === 'pending' ? 'Ожидает ответа' : 'Отвечено'}
                        </Badge>
                      </div>
                      <p className="text-sm mb-2">{question.question}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs text-muted-foreground">{question.date}</span>
                        <Link to={`/questions/${question.id}`}>
                          <Button size="sm" variant={question.status === 'pending' ? 'default' : 'outline'}>
                            {question.status === 'pending' ? 'Ответить' : 'Просмотреть'}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Link to="/questions">
                    <Button variant="outline">
                      Все вопросы
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>ИИ-ассистент</CardTitle>
                <CardDescription>Используйте ИИ для помощи в обучении</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="border border-border rounded-lg p-4 bg-primary/5">
                    <h4 className="font-medium mb-2">Автоматическая проверка тестов</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Используйте ИИ для автоматической проверки тестов и заданий студентов, экономя ваше время.
                    </p>
                    <Button variant="outline" size="sm">
                      <Brain className="h-4 w-4 mr-1" />
                      Настроить
                    </Button>
                  </div>
                  
                  <div className="border border-border rounded-lg p-4 bg-primary/5">
                    <h4 className="font-medium mb-2">Генерация учебных материалов</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Создавайте учебные материалы, задания и тесты с помощью ИИ на основе вашей программы.
                    </p>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      Создать
                    </Button>
                  </div>
                  
                  <div className="border border-border rounded-lg p-4 bg-primary/5">
                    <h4 className="font-medium mb-2">Анализ успеваемости</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Получите глубокий анализ успеваемости ваших студентов и рекомендации по улучшению обучения.
                    </p>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Анализировать
                    </Button>
                  </div>
                </div>
                
                <Link to="/ai-assistant">
                  <Button className="w-full">
                    Открыть ИИ-ассистент
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TeacherDashboard;
