
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  BookOpen,
  Clock,
  Users,
  Star,
  Play,
  FileText,
  CheckCircle,
  Lock,
  Brain,
  MessageCircle,
} from 'lucide-react';

const CourseDetails = () => {
  const { id } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(id === '1' || id === '3');

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Mock data for the course
  const course = {
    id: id,
    title: 'Математика для ЕНТ: полный курс',
    description:
      'Этот курс охватывает все основные темы по математике, которые включены в программу ЕНТ. Вы изучите алгебру, геометрию, тригонометрию и основы математического анализа. Каждый урок содержит теоретический материал и практические задания в формате ЕНТ.',
    longDescription:
      'Математика является одним из основных предметов на ЕНТ, и высокий балл по ней открывает двери во многие престижные ВУЗы. Наш курс разработан опытными преподавателями, которые глубоко понимают требования экзамена и типичные сложности, с которыми сталкиваются студенты.\n\nВ курсе вы найдете пошаговые объяснения всех тем, от базовых концепций до сложных задач. Мы уделяем особое внимание типичным заданиям ЕНТ, разбираем стратегии решения и помогаем избежать распространенных ошибок.\n\nПо каждой теме предусмотрены практические задания и тесты, которые помогут закрепить материал и оценить свой прогресс. Наш ИИ-ассистент всегда готов ответить на ваши вопросы и предложить дополнительные объяснения, если какая-то тема вызывает затруднения.',
    instructor: 'Асанов Болат',
    instructorRole: 'Старший преподаватель математики, КазНУ',
    instructorBio:
      'Болат Асанов - опытный преподаватель математики с 15-летним стажем работы. Подготовил более 500 учеников к ЕНТ, многие из которых набрали более 120 баллов и поступили в ведущие вузы Казахстана и зарубежья.',
    instructorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    category: 'Математика',
    rating: 4.9,
    reviews: 124,
    students: 1250,
    lessons: 42,
    duration: '36 часов',
    lastUpdated: 'Апрель 2023',
    language: 'Русский, Казахский',
    level: 'Все уровни',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop',
    progress: 65,
    sections: [
      {
        id: 's1',
        title: 'Введение в курс',
        lessons: [
          {
            id: 'l1',
            title: 'Обзор программы ЕНТ по математике',
            duration: '15 мин',
            type: 'video',
            completed: true,
          },
          {
            id: 'l2',
            title: 'Как эффективно готовиться к ЕНТ',
            duration: '20 мин',
            type: 'video',
            completed: true,
          },
          {
            id: 'l3',
            title: 'Вводный тест для определения уровня',
            duration: '30 мин',
            type: 'test',
            completed: true,
          },
        ],
      },
      {
        id: 's2',
        title: 'Алгебра: основные понятия',
        lessons: [
          {
            id: 'l4',
            title: 'Числовые множества',
            duration: '35 мин',
            type: 'video',
            completed: true,
          },
          {
            id: 'l5',
            title: 'Степени и корни',
            duration: '40 мин',
            type: 'video',
            completed: true,
          },
          {
            id: 'l6',
            title: 'Многочлены и алгебраические выражения',
            duration: '45 мин',
            type: 'video',
            completed: false,
          },
          {
            id: 'l7',
            title: 'Практическое задание: упрощение выражений',
            duration: '30 мин',
            type: 'assignment',
            completed: false,
          },
          {
            id: 'l8',
            title: 'Тест по основам алгебры',
            duration: '25 мин',
            type: 'test',
            completed: false,
          },
        ],
      },
      {
        id: 's3',
        title: 'Уравнения и неравенства',
        lessons: [
          {
            id: 'l9',
            title: 'Линейные уравнения и системы',
            duration: '40 мин',
            type: 'video',
            completed: false,
          },
          {
            id: 'l10',
            title: 'Квадратные уравнения и формулы',
            duration: '50 мин',
            type: 'video',
            completed: false,
          },
          {
            id: 'l11',
            title: 'Неравенства: решение и методы',
            duration: '45 мин',
            type: 'video',
            completed: false,
          },
          {
            id: 'l12',
            title: 'Практикум по решению уравнений',
            duration: '35 мин',
            type: 'assignment',
            completed: false,
          },
          {
            id: 'l13',
            title: 'Тест: уравнения и неравенства',
            duration: '30 мин',
            type: 'test',
            completed: false,
          },
        ],
      },
    ],
    whatYouLearn: [
      'Все разделы математики, включенные в программу ЕНТ',
      'Решение типовых задач и примеров из ЕНТ прошлых лет',
      'Методы быстрого решения задач на экзамене',
      'Разбор типичных ошибок и как их избежать',
      'Стратегии эффективной подготовки к экзамену',
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-16">
        {/* Course Header */}
        <div className="relative bg-gradient-to-r from-primary/5 to-blue-500/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2">
                <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  <div className="mb-4 flex items-center">
                    <Link to="/courses" className="text-primary hover:underline">
                      Курсы
                    </Link>
                    <span className="mx-2 text-muted-foreground">/</span>
                    <span className="text-muted-foreground">{course.category}</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
                  <p className="text-xl text-muted-foreground mb-6">
                    {course.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={course.instructorAvatar} alt={course.instructor} />
                        <AvatarFallback>{course.instructor.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span>{course.instructor}</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{course.lessons} уроков</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{course.students} учеников</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-400" />
                      <span>
                        {course.rating.toFixed(1)} ({course.reviews} отзывов)
                      </span>
                    </div>
                  </div>

                  {isEnrolled && (
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Прогресс курса</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  )}

                  {isEnrolled ? (
                    <Link to={`/course/${id}/learn`}>
                      <Button size="lg" className="mr-4 animate-hover">
                        <Play className="mr-2 h-4 w-4" />
                        Продолжить обучение
                      </Button>
                    </Link>
                  ) : (
                    <Button size="lg" onClick={() => setIsEnrolled(true)} className="mr-4 animate-hover">
                      Начать обучение бесплатно
                    </Button>
                  )}
                </div>
              </div>

              <div className={`transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-500 rounded-2xl blur opacity-20"></div>
                  <div className="relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-border/50">
                    <div className="aspect-video relative group cursor-pointer">
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all flex items-center justify-center">
                        <div className="bg-primary/90 rounded-full p-4 transform transition-transform duration-300 group-hover:scale-110">
                          <Play className="h-6 w-6 text-white" fill="white" />
                        </div>
                        <span className="absolute bottom-4 left-4 text-white text-sm font-medium bg-black/60 px-2 py-1 rounded">
                          Смотреть вступление
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="space-y-4 mb-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-muted-foreground mr-2" />
                            <span className="text-sm">Уроки</span>
                          </div>
                          <span className="font-medium">{course.lessons}</span>
                        </div>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <Clock className="h-5 w-5 text-muted-foreground mr-2" />
                            <span className="text-sm">Длительность</span>
                          </div>
                          <span className="font-medium">{course.duration}</span>
                        </div>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <Brain className="h-5 w-5 text-muted-foreground mr-2" />
                            <span className="text-sm">Сложность</span>
                          </div>
                          <span className="font-medium">{course.level}</span>
                        </div>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <MessageCircle className="h-5 w-5 text-muted-foreground mr-2" />
                            <span className="text-sm">Язык</span>
                          </div>
                          <span className="font-medium">{course.language}</span>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="text-center">
                        <span className="text-sm text-muted-foreground">
                          Последнее обновление: {course.lastUpdated}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="content">Содержание курса</TabsTrigger>
              <TabsTrigger value="about">О курсе</TabsTrigger>
              <TabsTrigger value="instructor">Преподаватель</TabsTrigger>
            </TabsList>

            <TabsContent value="content">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-bold mb-6">Программа курса</h2>
                  <div className="space-y-6">
                    {course.sections.map((section, index) => (
                      <div key={section.id} className="glass-card">
                        <div className="p-5 border-b border-border/50">
                          <h3 className="font-medium text-lg">
                            {index + 1}. {section.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {section.lessons.length} уроков
                          </p>
                        </div>
                        <div className="p-2">
                          {section.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className={`flex items-center justify-between p-3 rounded-lg hover:bg-secondary/40 transition-colors ${
                                isEnrolled || index === 0
                                  ? 'cursor-pointer'
                                  : 'opacity-70 cursor-not-allowed'
                              }`}
                            >
                              <div className="flex items-start">
                                <div className="mr-3">
                                  {lesson.type === 'video' ? (
                                    <Play className="h-5 w-5 text-primary" />
                                  ) : lesson.type === 'test' ? (
                                    <FileText className="h-5 w-5 text-orange-500" />
                                  ) : (
                                    <BookOpen className="h-5 w-5 text-blue-500" />
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-medium text-sm">{lesson.title}</h4>
                                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>{lesson.duration}</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                {lesson.completed ? (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : isEnrolled || index === 0 ? (
                                  <Play className="h-5 w-5 text-muted-foreground" />
                                ) : (
                                  <Lock className="h-5 w-5 text-muted-foreground" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-6">Чему вы научитесь</h2>
                  <div className="glass-card p-6">
                    <ul className="space-y-4">
                      {course.whatYouLearn.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mr-3 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <h2 className="text-2xl font-bold my-6">Получите доступ</h2>
                  <div className="glass-card p-6">
                    <p className="text-muted-foreground mb-6">
                      Начните обучение прямо сейчас и получите доступ ко всем материалам курса
                    </p>
                    {isEnrolled ? (
                      <Link to={`/course/${id}/learn`}>
                        <Button className="w-full">Продолжить обучение</Button>
                      </Link>
                    ) : (
                      <Button onClick={() => setIsEnrolled(true)} className="w-full">
                        Начать обучение бесплатно
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="about">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-bold mb-6">О курсе</h2>
                  <div className="glass-card p-6">
                    <div className="prose prose-blue max-w-none dark:prose-invert">
                      {course.longDescription.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="mb-4 text-muted-foreground leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    <h3 className="text-xl font-semibold mt-8 mb-4">Для кого этот курс</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mr-3 mt-0.5" />
                        <span>Учеников 10-11 классов, готовящихся к ЕНТ</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mr-3 mt-0.5" />
                        <span>Абитуриентов, планирующих поступление в технические ВУЗы</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mr-3 mt-0.5" />
                        <span>Всех, кто хочет улучшить свои знания по математике</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-6">Информация о курсе</h2>
                  <div className="glass-card p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm text-muted-foreground">Категория</h3>
                        <p className="font-medium">{course.category}</p>
                      </div>
                      <div>
                        <h3 className="text-sm text-muted-foreground">Последнее обновление</h3>
                        <p className="font-medium">{course.lastUpdated}</p>
                      </div>
                      <div>
                        <h3 className="text-sm text-muted-foreground">Язык</h3>
                        <p className="font-medium">{course.language}</p>
                      </div>
                      <div>
                        <h3 className="text-sm text-muted-foreground">Уровень</h3>
                        <p className="font-medium">{course.level}</p>
                      </div>
                      <div>
                        <h3 className="text-sm text-muted-foreground">Студенты</h3>
                        <p className="font-medium">{course.students}</p>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <h3 className="text-lg font-semibold mb-4">Включает</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Play className="h-5 w-5 text-primary mr-3" />
                        <span>{course.lessons} видеоуроков</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-primary mr-3" />
                        <span>Тесты для проверки знаний</span>
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="h-5 w-5 text-primary mr-3" />
                        <span>Дополнительные материалы</span>
                      </div>
                      <div className="flex items-center">
                        <Brain className="h-5 w-5 text-primary mr-3" />
                        <span>Доступ к ИИ-ассистенту</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="instructor">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Преподаватель</h2>
                <div className="glass-card p-6">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start">
                    <Avatar className="h-24 w-24 mb-4 sm:mb-0 sm:mr-6">
                      <AvatarImage src={course.instructorAvatar} alt={course.instructor} />
                      <AvatarFallback>{course.instructor.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">{course.instructor}</h3>
                      <Badge variant="outline" className="mt-1 mb-2">
                        {course.instructorRole}
                      </Badge>
                      <div className="flex items-center text-sm mb-4">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span>
                          {course.rating.toFixed(1)} • {course.students} студентов •{' '}
                          {course.lessons} видеоуроков
                        </span>
                      </div>
                      <p className="text-muted-foreground">{course.instructorBio}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CourseDetails;
