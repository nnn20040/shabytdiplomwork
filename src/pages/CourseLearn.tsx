
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LessonContent from '@/components/courses/LessonContent';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Check, Lock, PlayCircle, FileText, BookOpen, ChevronRight, ChevronDown } from 'lucide-react';
import { Course, Lesson, Section } from '@/models/Course';
import { toast } from 'sonner';

const CourseLearn = () => {
  const { id, lessonId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course>({
    id: '',
    title: '',
    description: '',
    instructor: '',
    category: '',
    image: '',
    rating: 0,
    students: 0,
    sections: []
  });
  
  const [currentLessonId, setCurrentLessonId] = useState<string>(lessonId || '');
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [courseProgress, setCourseProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would make an API call here
        // For now, we'll simulate a delay and return mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock course data
        const mockCourse: Course = {
          id: '1',
          title: 'Математика для ЕНТ: полный курс',
          description: 'Комплексная подготовка к ЕНТ по математике с нуля до продвинутого уровня',
          instructor: 'Адильжан Мақсат',
          category: 'Математика',
          image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop',
          rating: 4.9,
          students: 1250,
          sections: [
            {
              id: 's1',
              title: 'Введение',
              lessons: [
                {
                  id: 'l1',
                  title: '1. Введение в курс',
                  description: 'Обзор программы и целей курса',
                  video_url: 'https://www.youtube.com/embed/pJpBYlvB2a8',
                  content: 'Добро пожаловать на курс "Математика для ЕНТ"! В этом вводном уроке мы обсудим цели курса, его структуру и методы обучения. Вы узнаете, как наиболее эффективно использовать материалы курса для подготовки к ЕНТ.\n\nЭтот курс разработан опытными преподавателями, которые помогли сотням студентов успешно сдать ЕНТ на высокие баллы. Мы собрали самые важные темы, типовые задания и эффективные методы решения, которые помогут вам чувствовать себя уверенно на экзамене.\n\nВ конце каждого раздела вы найдете практические задания и тесты, которые помогут закрепить пройденный материал. Рекомендуем выполнять их сразу после изучения соответствующей темы.',
                  completed: true,
                  type: 'video',
                  duration: '10 минут'
                },
                {
                  id: 'l2',
                  title: '2. Как эффективно готовиться к ЕНТ',
                  description: 'Стратегии подготовки и планирование',
                  video_url: 'https://www.youtube.com/embed/pJpBYlvB2a8',
                  content: 'В этом уроке мы обсудим эффективные стратегии подготовки к ЕНТ по математике. Вы узнаете, как правильно планировать свое время, какие темы требуют особого внимания и как отслеживать свой прогресс.\n\nОсновные стратегии подготовки:\n1. Регулярность - занимайтесь каждый день, даже если это всего 30 минут\n2. Концентрация - выделите отдельное время для занятий без отвлечений\n3. Повторение - регулярно возвращайтесь к пройденному материалу\n4. Практика - решайте как можно больше задач разного типа\n5. Анализ ошибок - внимательно разбирайте свои ошибки\n\nМы рекомендуем создать план подготовки, разбив все темы по неделям. Начните с базовых понятий и постепенно переходите к более сложным темам. Обязательно оставьте время перед экзаменом для повторения всего материала.',
                  completed: false,
                  type: 'text',
                  duration: '15 минут'
                }
              ]
            },
            {
              id: 's2',
              title: 'Алгебра',
              lessons: [
                {
                  id: 'l3',
                  title: '1. Числа и выражения',
                  description: 'Основные понятия и операции',
                  video_url: 'https://www.youtube.com/embed/pJpBYlvB2a8',
                  content: 'В этом уроке мы рассмотрим основные понятия алгебры: числа, выражения и операции над ними. Эти базовые знания являются фундаментом для изучения более сложных тем.\n\nМы подробно разберем:\n- Натуральные, целые, рациональные и иррациональные числа\n- Алгебраические выражения и их преобразования\n- Степени и корни\n- Модуль числа и его свойства\n\nВажно хорошо усвоить эти темы, так как они встречаются во многих заданиях ЕНТ и являются базой для решения уравнений и неравенств.',
                  completed: false,
                  type: 'video',
                  duration: '25 минут'
                },
                {
                  id: 'l4',
                  title: '2. Алгебра: основные понятия',
                  description: 'Уравнения, неравенства и системы',
                  video_url: 'https://www.youtube.com/embed/pJpBYlvB2a8',
                  content: 'В этом уроке мы изучим основные понятия алгебры: уравнения, неравенства и системы. Вы узнаете методы их решения и применения.\n\nОсновные темы урока:\n1. Линейные уравнения и их свойства\n2. Квадратные уравнения и формула корней\n3. Теорема Виета и ее применение\n4. Уравнения высших степеней\n5. Линейные и квадратные неравенства\n6. Системы уравнений и методы их решения\n\nУмение решать уравнения и неравенства - одно из ключевых требований ЕНТ по математике. Мы рассмотрим различные типы заданий и эффективные способы их решения.',
                  completed: false,
                  type: 'text',
                  duration: '30 минут'
                }
              ]
            }
          ]
        };
        
        setCourse(mockCourse);
        
        // Set default lesson if not specified
        if (!currentLessonId && mockCourse.sections && mockCourse.sections.length > 0 && mockCourse.sections[0].lessons.length > 0) {
          const firstLesson = mockCourse.sections[0].lessons[0];
          setCurrentLessonId(String(firstLesson.id));
          setCurrentLesson(firstLesson);
          
          // Update URL
          navigate(`/course/${id}/learn?lesson=${firstLesson.id}`, { replace: true });
        } else if (currentLessonId) {
          // Find the current lesson
          let foundLesson = null;
          
          for (const section of mockCourse.sections || []) {
            for (const lesson of section.lessons) {
              if (String(lesson.id) === currentLessonId) {
                foundLesson = lesson;
                break;
              }
            }
            if (foundLesson) break;
          }
          
          if (foundLesson) {
            setCurrentLesson(foundLesson);
          } else {
            // If lesson not found, set to first lesson
            const firstLesson = mockCourse.sections[0].lessons[0];
            setCurrentLessonId(String(firstLesson.id));
            setCurrentLesson(firstLesson);
            navigate(`/course/${id}/learn?lesson=${firstLesson.id}`, { replace: true });
          }
        }
        
        // Calculate progress
        if (mockCourse.sections) {
          let completed = 0;
          let total = 0;
          
          mockCourse.sections.forEach(section => {
            section.lessons.forEach(lesson => {
              total++;
              if (lesson.completed) {
                completed++;
              }
            });
          });
          
          setCourseProgress(total > 0 ? (completed / total) * 100 : 0);
        }
        
        // Set all sections expanded by default
        if (mockCourse.sections) {
          setExpandedSections(mockCourse.sections.map(section => String(section.id)));
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        toast.error('Ошибка при загрузке курса');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourse();
  }, [id, currentLessonId, navigate]);
  
  const handleLessonSelect = (lesson: Lesson) => {
    setCurrentLessonId(String(lesson.id));
    setCurrentLesson(lesson);
    navigate(`/course/${id}/learn?lesson=${lesson.id}`, { replace: true });
    window.scrollTo(0, 0);
  };
  
  const handleLessonComplete = () => {
    // Find and update the completed status of the current lesson
    if (currentLesson) {
      const updatedCourse = { ...course };
      
      if (updatedCourse.sections) {
        for (const section of updatedCourse.sections) {
          for (let i = 0; i < section.lessons.length; i++) {
            if (String(section.lessons[i].id) === String(currentLesson.id)) {
              section.lessons[i].completed = true;
              break;
            }
          }
        }
        
        setCourse(updatedCourse);
        
        // Recalculate progress
        let completed = 0;
        let total = 0;
        
        updatedCourse.sections.forEach(section => {
          section.lessons.forEach(lesson => {
            total++;
            if (lesson.completed) {
              completed++;
            }
          });
        });
        
        setCourseProgress(total > 0 ? (completed / total) * 100 : 0);
        
        toast.success('Урок отмечен как завершенный');
      }
    }
  };
  
  const getNextLesson = (): Lesson | null => {
    if (!currentLesson || !course.sections) return null;
    
    let foundCurrent = false;
    
    for (const section of course.sections) {
      for (let i = 0; i < section.lessons.length; i++) {
        // If we found the current lesson and we're not at the end of this section
        if (foundCurrent && i < section.lessons.length) {
          return section.lessons[i];
        }
        
        // Mark that we found the current lesson
        if (String(section.lessons[i].id) === String(currentLesson.id)) {
          foundCurrent = true;
          
          // If this is the last lesson of this section, we'll continue to the next section
          if (i === section.lessons.length - 1) {
            continue;
          }
        }
      }
    }
    
    return null;
  };
  
  const getPreviousLesson = (): Lesson | null => {
    if (!currentLesson || !course.sections) return null;
    
    let previousLesson: Lesson | null = null;
    
    for (const section of course.sections) {
      for (const lesson of section.lessons) {
        if (String(lesson.id) === String(currentLesson.id)) {
          return previousLesson;
        }
        previousLesson = lesson;
      }
    }
    
    return null;
  };
  
  const handleNextLesson = () => {
    const nextLesson = getNextLesson();
    if (nextLesson) {
      handleLessonSelect(nextLesson);
    }
  };
  
  const handlePreviousLesson = () => {
    const previousLesson = getPreviousLesson();
    if (previousLesson) {
      handleLessonSelect(previousLesson);
    }
  };
  
  const toggleSectionExpand = (sectionId: string | number) => {
    setExpandedSections(prev => {
      if (prev.includes(String(sectionId))) {
        return prev.filter(id => id !== String(sectionId));
      } else {
        return [...prev, String(sectionId)];
      }
    });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4">
                  <div className="h-[500px] bg-gray-200 rounded"></div>
                </div>
                <div className="md:w-3/4">
                  <div className="h-[600px] bg-gray-200 rounded"></div>
                </div>
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
      
      <main className="flex-1 pt-16 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">{course.title}</h1>
              <p className="text-muted-foreground">Преподаватель: {course.instructor}</p>
            </div>
            
            <div className="text-right">
              <div className="flex items-center mb-2">
                <span className="text-sm text-muted-foreground mr-2">Прогресс курса:</span>
                <span className="text-sm font-medium">{Math.round(courseProgress)}%</span>
              </div>
              <Progress value={courseProgress} className="w-40 h-2" />
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar with course sections and lessons */}
            <div className="lg:w-1/4">
              <div className="bg-card rounded-lg border shadow-sm p-4 sticky top-20">
                <h2 className="text-lg font-semibold mb-4">Содержание курса</h2>
                
                <div className="space-y-3">
                  {course.sections?.map((section) => (
                    <div key={section.id} className="border-b border-border last:border-0 pb-3 last:pb-0">
                      <button
                        className="flex justify-between items-center w-full text-left font-medium py-1"
                        onClick={() => toggleSectionExpand(section.id)}
                      >
                        <span>{section.title}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.includes(String(section.id)) ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {expandedSections.includes(String(section.id)) && (
                        <ul className="mt-2 space-y-1">
                          {section.lessons.map((lesson) => {
                            const isActive = currentLessonId === String(lesson.id);
                            const isCompleted = lesson.completed;
                            
                            return (
                              <li key={lesson.id}>
                                <button
                                  className={`flex items-start w-full text-left p-2 rounded text-sm ${
                                    isActive ? 'bg-primary/10 text-primary' : 'hover:bg-accent/50'
                                  }`}
                                  onClick={() => handleLessonSelect(lesson)}
                                >
                                  <div className="flex-shrink-0 mt-0.5 mr-2">
                                    {isCompleted ? (
                                      <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                      lesson.type === 'video' ? (
                                        <PlayCircle className="h-4 w-4 text-muted-foreground" />
                                      ) : (
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                      )
                                    )}
                                  </div>
                                  <span className="line-clamp-2">{lesson.title}</span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Main content area */}
            <div className="lg:w-3/4">
              {currentLesson ? (
                <LessonContent
                  lesson={currentLesson}
                  onComplete={handleLessonComplete}
                  onNext={handleNextLesson}
                  onPrevious={handlePreviousLesson}
                  progress={currentLesson.completed ? 100 : 0}
                  hasNext={!!getNextLesson()}
                  hasPrevious={!!getPreviousLesson()}
                />
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Выберите урок</h2>
                    <p className="text-muted-foreground mb-6">
                      Выберите урок из списка слева, чтобы начать обучение
                    </p>
                    <Button onClick={() => {
                      if (course.sections && course.sections.length > 0 && course.sections[0].lessons.length > 0) {
                        handleLessonSelect(course.sections[0].lessons[0]);
                      }
                    }}>
                      Начать с первого урока
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CourseLearn;
