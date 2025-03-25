import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CourseCard from '@/components/ui/CourseCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Calendar, CheckCircle, Clock, Search, Filter, ArrowRight, Brain, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface SubjectInfo {
  id: string;
  title: string;
  description: string;
  icon: string;
  courses: number;
  color: string;
  bgImage: string;
}

const subjectsData: { [key: string]: SubjectInfo } = {
  mathematics: {
    id: 'mathematics',
    title: 'Математика',
    description: 'Подготовка к ЕНТ по математике: алгебра, геометрия, математический анализ',
    icon: '➗',
    courses: 12,
    color: 'from-blue-600 to-indigo-600',
    bgImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop',
  },
  physics: {
    id: 'physics',
    title: 'Физика',
    description: 'Подготовка к ЕНТ по физике: механика, электричество, оптика, атомная физика',
    icon: '⚛️',
    courses: 10,
    color: 'from-purple-600 to-indigo-600',
    bgImage: 'https://images.unsplash.com/photo-1636466497217-26a42372b4c8?q=80&w=800&auto=format&fit=crop',
  },
  history: {
    id: 'history',
    title: 'История Казахстана',
    description: 'Подготовка к ЕНТ по истории Казахстана: от древности до современности',
    icon: '📜',
    courses: 8,
    color: 'from-amber-600 to-orange-600',
    bgImage: 'https://images.unsplash.com/photo-1572186192734-e82b56d4bb31?q=80&w=800&auto=format&fit=crop',
  },
  kazakh: {
    id: 'kazakh',
    title: 'Казахский язык',
    description: 'Подготовка к ЕНТ по казахскому языку: грамматика, лексика, стилистика',
    icon: '🔤',
    courses: 7,
    color: 'from-green-600 to-teal-600',
    bgImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop',
  },
  russian: {
    id: 'russian',
    title: 'Русский язык',
    description: 'Подготовка к ЕНТ по русскому языку: грамматика, лексика, стилистика',
    icon: '🔤',
    courses: 7,
    color: 'from-red-600 to-rose-600',
    bgImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop',
  },
  chemistry: {
    id: 'chemistry',
    title: 'Химия',
    description: 'Подготовка к ЕНТ по химии: неорганическая и органическая химия',
    icon: '🧪',
    courses: 6,
    color: 'from-emerald-600 to-green-600',
    bgImage: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?q=80&w=800&auto=format&fit=crop',
  },
  biology: {
    id: 'biology',
    title: 'Биология',
    description: 'Подготовка к ЕНТ по биологии: ботаника, зоология, анатомия, генетика',
    icon: '🧬',
    courses: 6,
    color: 'from-green-600 to-lime-600',
    bgImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop',
  },
  english: {
    id: 'english',
    title: 'Английский язы��',
    description: 'Подготовка к ЕНТ по английскому языку: грамматика, лексика, аудирование',
    icon: '🔤',
    courses: 5,
    color: 'from-sky-600 to-blue-600',
    bgImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop',
  },
  geography: {
    id: 'geography',
    title: 'География',
    description: 'Подготовка к ЕНТ по географии: физическая, экономическая и политическая география',
    icon: '🌍',
    courses: 4,
    color: 'from-teal-600 to-cyan-600',
    bgImage: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=800&auto=format&fit=crop',
  },
};

const mockCourses = [
  {
    id: '1',
    title: 'Математика для ЕНТ: полный курс',
    description: 'Комплексная подготовка к ЕНТ по математике с нуля до продвинутого уровня',
    instructor: 'Асанов Болат',
    category: 'Математика',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    reviews: 124,
    students: 1250,
    price: 0,
    level: 'Все уровни',
    language: 'Русский',
    lastUpdated: 'Апрель 2023',
    features: ['42 видеоурока', '15 тестов', 'Практические задания', 'Сертификат'],
  },
  {
    id: '2',
    title: 'Алгебра для ЕНТ',
    description: 'Погрузитесь в мир алгебры и подготовьтесь к экзамену на высокий балл',
    instructor: 'Сатпаев Марат',
    category: 'Математика',
    image: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?q=80&w=800&auto=format&fit=crop',
    rating: 4.7,
    reviews: 98,
    students: 870,
    price: 0,
    level: 'Средний',
    language: 'Русский, Казахский',
    lastUpdated: 'Июнь 2023',
    features: ['36 видеоуроков', '12 тестов', 'Форум поддержки', 'Сертификат'],
  },
  {
    id: '3',
    title: 'Геометрия для ЕНТ',
    description: 'Все темы школьной геометрии с разбором типовых задач ЕНТ',
    instructor: 'Алимова Айгуль',
    category: 'Математика',
    image: 'https://images.unsplash.com/photo-1509869175650-a1d97972541a?q=80&w=800&auto=format&fit=crop',
    rating: 4.8,
    reviews: 76,
    students: 650,
    price: 0,
    level: 'Базовый',
    language: 'Русский',
    lastUpdated: 'Май 2023',
    features: ['28 видеоуроков', '10 тестов', 'Интерактивные задания', 'Сертификат'],
  },
  {
    id: '4',
    title: 'Тригонометрия: от основ до ЕНТ',
    description: 'Полный курс тригонометрии с примерами решения задач ЕНТ прошлых лет',
    instructor: 'Ахметов Рустем',
    category: 'Математика',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop',
    rating: 4.6,
    reviews: 52,
    students: 420,
    price: 0,
    level: 'Продвинутый',
    language: 'Русский, Казахский',
    lastUpdated: 'Июль 2023',
    features: ['22 видеоурока', '8 тестов', 'Персональная обратная связь', 'Сертификат'],
  },
  {
    id: '5',
    title: 'Физика для технических ВУЗов',
    description: 'Продвинутый курс физики для подготовки к ЕНТ и поступлению в технические ВУЗы',
    instructor: 'Толегенов Даулет',
    category: 'Физика',
    image: 'https://images.unsplash.com/photo-1636466497217-26a42372b4c8?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    reviews: 87,
    students: 760,
    price: 0,
    level: 'Продвинутый',
    language: 'Русский',
    lastUpdated: 'Март 2023',
    features: ['40 видеоуроков', '15 тестов', 'Виртуальные лабораторные работы', 'Сертификат'],
  },
];

type FilterOptions = {
  level: string;
  language: string;
  sorting: string;
};

const SubjectPage = () => {
  const { subject } = useParams<{ subject: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    level: 'all',
    language: 'all',
    sorting: 'popular',
  });
  
  const [coursesData, setCoursesData] = useState<any[]>([]);
  const [subjectInfo, setSubjectInfo] = useState<SubjectInfo | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (subject && subjectsData[subject]) {
          setSubjectInfo(subjectsData[subject]);
          
          const filteredCourses = mockCourses.filter(
            course => course.category.toLowerCase() === subjectsData[subject].title.toLowerCase()
          );
          
          setCoursesData(filteredCourses);
        } else {
          toast.error('Предмет не найден');
        }
      } catch (error) {
        console.error('Error fetching subject data:', error);
        toast.error('Ошибка при загрузке данных');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [subject]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilterOptions(prev => ({ ...prev, [key]: value }));
  };
  
  const getFilteredCourses = () => {
    let filtered = [...coursesData];
    
    if (searchTerm) {
      filtered = filtered.filter(
        course => course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (activeTab === 'free') {
      filtered = filtered.filter(course => course.price === 0);
    } else if (activeTab === 'paid') {
      filtered = filtered.filter(course => course.price > 0);
    }
    
    if (filterOptions.level !== 'all') {
      filtered = filtered.filter(course => course.level === filterOptions.level);
    }
    
    if (filterOptions.language !== 'all') {
      filtered = filtered.filter(
        course => course.language.toLowerCase().includes(filterOptions.language.toLowerCase())
      );
    }
    
    if (filterOptions.sorting === 'popular') {
      filtered.sort((a, b) => b.students - a.students);
    } else if (filterOptions.sorting === 'newest') {
      filtered.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
    } else if (filterOptions.sorting === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }
    
    return filtered;
  };
  
  const filteredCourses = getFilteredCourses();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-64 bg-muted rounded-lg mb-8 animate-pulse"></div>
            <div className="flex justify-between mb-8 animate-pulse">
              <div className="h-10 bg-muted rounded w-1/3"></div>
              <div className="h-10 bg-muted rounded w-1/4"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-80 bg-muted rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!subjectInfo) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Предмет не найден</h1>
            <p className="text-muted-foreground mb-8">
              Запрашиваемый предмет не существует или был удален.
            </p>
            <Button onClick={() => window.history.back()}>
              Вернуться назад
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16">
        <div 
          className={`relative bg-gradient-to-r ${subjectInfo.color} mb-12`}
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4)), url(${subjectInfo.bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-white">
            <div className="max-w-3xl">
              <span className="text-5xl mb-6 inline-block">{subjectInfo.icon}</span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {subjectInfo.title}
              </h1>
              <p className="text-xl md:text-2xl opacity-90 mb-8">
                {subjectInfo.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  Начать обучение
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  Узнать больше
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardContent className="p-6 flex items-center">
                <div className="mr-4 bg-primary/10 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{subjectInfo.courses}</p>
                  <p className="text-muted-foreground">Курсов</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-center">
                <div className="mr-4 bg-primary/10 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold">98%</p>
                  <p className="text-muted-foreground">Успеваемость</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-center">
                <div className="mr-4 bg-primary/10 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold">120+</p>
                  <p className="text-muted-foreground">Часов контента</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-center">
                <div className="mr-4 bg-primary/10 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold">3-6</p>
                  <p className="text-muted-foreground">Месяцев обучения</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div className="relative w-full md:w-1/2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Поиск курсов по ${subjectInfo.title}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center"
              >
                <Filter className="h-4 w-4 mr-2" />
                Фильтры
              </Button>
            </div>
            
            {showFilters && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium block mb-2">Уровень</label>
                      <select
                        value={filterOptions.level}
                        onChange={(e) => handleFilterChange('level', e.target.value)}
                        className="w-full p-2 rounded-md border border-input bg-background"
                      >
                        <option value="all">Все уровни</option>
                        <option value="Базовый">Базовый</option>
                        <option value="Средний">Средний</option>
                        <option value="Продвинутый">Продвинутый</option>
                        <option value="Все уровни">Все уровни</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium block mb-2">Язык</label>
                      <select
                        value={filterOptions.language}
                        onChange={(e) => handleFilterChange('language', e.target.value)}
                        className="w-full p-2 rounded-md border border-input bg-background"
                      >
                        <option value="all">Все языки</option>
                        <option value="Русский">Русский</option>
                        <option value="Казахский">Казахский</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium block mb-2">Сортировка</label>
                      <select
                        value={filterOptions.sorting}
                        onChange={(e) => handleFilterChange('sorting', e.target.value)}
                        className="w-full p-2 rounded-md border border-input bg-background"
                      >
                        <option value="popular">По популярности</option>
                        <option value="newest">Сначала новые</option>
                        <option value="rating">По рейтингу</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
            >
              <TabsList>
                <TabsTrigger value="all">Все курсы</TabsTrigger>
                <TabsTrigger value="free">Бесплатные</TabsTrigger>
                <TabsTrigger value="paid">Платные</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div>
            {filteredCourses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Курсы не найдены</h2>
                <p className="text-muted-foreground mb-6">
                  По вашему запросу не найдено ни одного курса
                </p>
                <Button onClick={() => {
                  setSearchTerm('');
                  setFilterOptions({
                    level: 'all',
                    language: 'all',
                    sorting: 'popular',
                  });
                  setActiveTab('all');
                }}>
                  Сбросить фильтры
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-6">
                  {filteredCourses.length} {filteredCourses.length === 1 ? 'курс' : 
                     filteredCourses.length < 5 ? 'курса' : 'курсов'} по предмету "{subjectInfo.title}"
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {filteredCourses.map(course => (
                    <CourseCard key={course.id} {...course} />
                  ))}
                </div>
                
                <div className="text-center">
                  <Button variant="outline" size="lg" className="mx-auto">
                    Показать больше курсов
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
          
          <div className="mt-16 mb-8">
            <h2 className="text-2xl font-bold mb-8">Почему стоит изучать {subjectInfo?.title} с нами</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="bg-primary/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Качественные материалы</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Все наши курсы разработаны опытными преподавателями и включают в себя все темы, необходимые для успешной сдачи ЕНТ.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="bg-primary/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Интерактивное обучение</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Видеоуроки, практические задания и тесты помогут вам не только выучить материал, но и закрепить его на практике.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="bg-primary/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Поддержка 24/7</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Наши преподаватели и ИИ-ассистент всегда готовы ответить на ваши вопросы и помочь разобраться в сложном материале.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SubjectPage;
