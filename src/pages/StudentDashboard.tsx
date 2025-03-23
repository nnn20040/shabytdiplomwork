
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import CourseCard from '@/components/ui/CourseCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, 
  Clock, 
  BarChart3, 
  Flame, 
  Brain,
  Calendar,
  ChevronRight,
  MessageCircle,
  Book,
  BookCheck,
  Search,
  PlusCircle
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const StudentDashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Математика', 'История']);
  const [availableSubjects] = useState([
    'Математика', 'Физика', 'Химия', 'Биология', 'История', 
    'География', 'Казахский язык', 'Русский язык', 'Английский язык'
  ]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Mock data for enrolled courses
  const enrolledCourses = [
    {
      id: '1',
      title: 'Математика для ЕНТ: полный курс',
      description: 'Подготовка по всем разделам математики для успешной сдачи ЕНТ',
      instructor: 'Асанов Болат',
      category: 'Математика',
      rating: 4.9,
      students: 1250,
      lessons: 42,
      duration: '36 часов',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=500&auto=format&fit=crop',
      progress: 65,
    },
    {
      id: '3',
      title: 'История Казахстана: даты и события',
      description: 'Систематизированный курс по истории Казахстана для ЕНТ',
      instructor: 'Муратов Ерлан',
      category: 'История',
      rating: 4.7,
      students: 920,
      lessons: 35,
      duration: '30 часов',
      image: 'https://images.unsplash.com/photo-1593696954577-ab3d39317b97?q=80&w=500&auto=format&fit=crop',
      progress: 40,
    },
  ];

  // Mock data for recommended courses
  const recommendedCourses = [
    {
      id: '2',
      title: 'Физика: механика и термодинамика',
      description: 'Все законы физики с примерами решения задач в формате ЕНТ',
      instructor: 'Сергеева Анна',
      category: 'Физика',
      rating: 4.8,
      students: 840,
      lessons: 38,
      duration: '32 часа',
      image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=500&auto=format&fit=crop',
    },
    {
      id: '4',
      title: 'Казахский язык: грамматика и лексика',
      description: 'Интенсивный курс казахского языка для подготовки к ЕНТ',
      instructor: 'Айгуль Калиева',
      category: 'Казахский язык',
      rating: 4.6,
      students: 750,
      lessons: 40,
      duration: '35 часов',
      image: 'https://images.unsplash.com/photo-1555431189-0fabf2667795?q=80&w=500&auto=format&fit=crop',
    },
  ];

  // Mock data for recent tests
  const recentTests = [
    {
      id: '1',
      title: 'Квадратные уравнения',
      course: 'Математика для ЕНТ',
      score: 85,
      maxScore: 100,
      date: '15 мая, 2023',
    },
    {
      id: '2',
      title: 'Казахстан в 20 веке',
      course: 'История Казахстана',
      score: 72,
      maxScore: 100,
      date: '12 мая, 2023',
    },
    {
      id: '3',
      title: 'Тригонометрические функции',
      course: 'Математика для ЕНТ',
      score: 90,
      maxScore: 100,
      date: '10 мая, 2023',
    },
  ];

  // Mock data for AI interactions
  const aiInteractions = [
    {
      id: '1',
      question: 'Как решать квадратные уравнения?',
      date: '2 часа назад',
    },
    {
      id: '2',
      question: 'Объясни закон Ома',
      date: 'Вчера',
    },
    {
      id: '3',
      question: 'Когда была принята Конституция РК?',
      date: '3 дня назад',
    },
  ];

  // Mock forum questions
  const forumQuestions = [
    {
      id: '1',
      title: 'Как подготовиться к математической части ЕНТ за 1 месяц?',
      author: 'Арман Сатаев',
      course: 'Математика для ЕНТ',
      replies: 8,
      date: '3 дня назад',
    },
    {
      id: '2',
      title: 'Какие исторические даты обязательно нужно знать?',
      author: 'Асель Кенжебаева',
      course: 'История Казахстана',
      replies: 12,
      date: '5 дней назад',
    },
  ];

  const handleAddSubject = (subject: string) => {
    if (!selectedSubjects.includes(subject)) {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleRemoveSubject = (subject: string) => {
    setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-3xl font-bold">Привет, Арман 👋</h1>
              <p className="text-muted-foreground mt-1">Добро пожаловать в личный кабинет</p>
            </div>
            <div className={`transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex items-center mt-4 md:mt-0 space-x-4">
                <div className="bg-secondary/50 rounded-lg py-2 px-4 text-sm">
                  <div className="font-medium">До ЕНТ осталось</div>
                  <div className="text-lg font-bold text-primary">42 дня</div>
                </div>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 border-2 border-primary">
                    <AvatarImage src="https://randomuser.me/api/portraits/men/32.jpg" />
                    <AvatarFallback>АС</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`mb-8 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Card>
              <CardHeader>
                <CardTitle>Предметы подготовки</CardTitle>
                <CardDescription>Выберите предметы, по которым вы хотите готовиться к ЕНТ</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedSubjects.map(subject => (
                    <Badge 
                      key={subject} 
                      variant="secondary" 
                      className="px-3 py-1 text-sm"
                    >
                      {subject}
                      <button 
                        className="ml-2 hover:text-destructive"
                        onClick={() => handleRemoveSubject(subject)}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <Select onValueChange={handleAddSubject}>
                    <SelectTrigger className="w-[260px]">
                      <SelectValue placeholder="Добавить предмет" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSubjects
                        .filter(subject => !selectedSubjects.includes(subject))
                        .map(subject => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Добавить
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className={`transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Общий прогресс</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">52%</div>
                <Progress value={52} className="h-2 mt-2" />
                <p className="text-xs text-muted-foreground mt-2">2 из 4 курсов в процессе</p>
              </CardContent>
            </Card>
            
            <Card className={`transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Сегодняшняя активность</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.5 часа</div>
                <Progress value={62} className="h-2 mt-2" />
                <p className="text-xs text-muted-foreground mt-2">62% от дневной цели</p>
              </CardContent>
            </Card>
            
            <Card className={`transition-all duration-700 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Серия достижений</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7 дней</div>
                <div className="flex justify-between mt-2">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Flame className="h-4 w-4 text-primary" />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Продолжай заниматься каждый день!</p>
              </CardContent>
            </Card>
          </div>
          
          <div className={`mb-10 transition-all duration-700 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Tabs defaultValue="enrolled" className="w-full">
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-bold">Мои курсы</h2>
                <TabsList>
                  <TabsTrigger value="enrolled">Активные</TabsTrigger>
                  <TabsTrigger value="recommended">Рекомендуемые</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="enrolled" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrolledCourses.map((course) => (
                    <div key={course.id} className="glass-card rounded-xl overflow-hidden">
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
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-2">{course.title}</h3>
                        <div className="flex justify-between text-sm text-muted-foreground mb-3">
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" />
                            <span>{course.lessons} уроков</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{course.duration}</span>
                          </div>
                        </div>
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Прогресс</span>
                            <span className="font-medium">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                        <Link to={`/course/${course.id}`}>
                          <Button className="w-full">Продолжить</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="recommended" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendedCourses.map((course) => (
                    <CourseCard key={course.id} {...course} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 transition-all duration-700 delay-800 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Недавние тесты</CardTitle>
                <CardDescription>Результаты последних пройденных тестов</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentTests.map((test) => (
                    <div key={test.id} className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start">
                        <div className="bg-primary/10 p-2 rounded-lg mr-3">
                          <BarChart3 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{test.title}</h4>
                          <p className="text-sm text-muted-foreground">{test.course}</p>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{test.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {test.score}/{test.maxScore}
                        </div>
                        <div className="text-sm mt-1">
                          <span className={`${test.score >= 80 ? 'text-green-500' : test.score >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                            {test.score}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Link to="/tests">
                    <Button variant="outline" className="w-full">
                      Все тесты
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ИИ-ассистент</CardTitle>
                <CardDescription>Недавние вопросы к ассистенту</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiInteractions.map((interaction) => (
                    <div key={interaction.id} className="flex items-start border-b border-border/50 pb-4 last:border-0 last:pb-0">
                      <div className="bg-primary/10 p-2 rounded-lg mr-3">
                        <Brain className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm line-clamp-1">{interaction.question}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{interaction.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Link to="/ai-assistant">
                    <Button className="w-full group">
                      <span className="mr-1">Задать вопрос</span>
                      <MessageCircle size={16} className="group-hover:scale-110 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className={`mb-8 transition-all duration-700 delay-900 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Card>
              <CardHeader>
                <CardTitle>Форум</CardTitle>
                <CardDescription>Вопросы и обсуждения по предметам ЕНТ</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input placeholder="Поиск по форуму..." className="pl-10" />
                  </div>
                  
                  <div className="space-y-4">
                    {forumQuestions.map((question) => (
                      <div key={question.id} className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium hover:text-primary transition-colors">
                              <Link to={`/forum/${question.id}`}>{question.title}</Link>
                            </h4>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <span className="mr-3">Автор: {question.author}</span>
                              <Badge variant="secondary" className="mr-3">{question.course}</Badge>
                              <span>{question.replies} ответов</span>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">{question.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Link to="/forum">
                    <Button variant="outline">
                      Все обсуждения
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                  
                  <Link to="/forum/new">
                    <Button>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Создать тему
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudentDashboard;
