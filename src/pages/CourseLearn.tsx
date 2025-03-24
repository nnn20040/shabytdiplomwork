
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight, List } from 'lucide-react';
import LessonContent from '@/components/courses/LessonContent';
import { Course, Lesson } from '@/models/Course';
import { toast } from 'sonner';

const CourseLearn = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    // For now using mock data, but this would be fetched from API
    const fetchCourse = async () => {
      setIsLoading(true);
      try {
        // Mock data for the course
        const mockCourse: Course = {
          id: courseId || '1',
          title: 'Математика для ЕНТ: полный курс',
          description: 'Этот курс охватывает все основные темы по математике, которые включены в программу ЕНТ.',
          instructor: 'Асанов Болат',
          category: 'Математика',
          image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop',
          progress: 35,
          sections: [
            {
              id: 's1',
              title: 'Введение в курс',
              lessons: [
                {
                  id: 'l1',
                  title: 'Обзор программы ЕНТ по математике',
                  description: 'Знакомство с программой ЕНТ по математике и структурой экзамена',
                  duration: '15 мин',
                  type: 'video',
                  completed: true,
                  video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                  content: 'Единое национальное тестирование (ЕНТ) - это стандартизированный экзамен, который сдают выпускники школ Казахстана для поступления в высшие учебные заведения.\n\nВ математической части ЕНТ проверяются знания по следующим разделам:\n\n1. **Алгебра и начала анализа**:\n   - Числа и алгебраические выражения\n   - Уравнения и неравенства\n   - Последовательности и прогрессии\n   - Функции, их свойства и графики\n   - Производная и её применение\n   - Интеграл и его применение\n\n2. **Геометрия**:\n   - Планиметрия (геометрия на плоскости)\n   - Стереометрия (геометрия в пространстве)\n   - Векторы и координаты\n\nФормат экзамена включает тестовые задания с выбором одного правильного ответа из пяти предложенных, а также задания с кратким ответом в виде числа или слова. На выполнение математической части ЕНТ отводится определенное время, обычно 120-150 минут.'
                },
                {
                  id: 'l2',
                  title: 'Как эффективно готовиться к ЕНТ',
                  description: 'Стратегии и методы подготовки к экзамену',
                  duration: '20 мин',
                  type: 'video',
                  completed: true,
                  video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                  content: 'Эффективная подготовка к ЕНТ по математике требует системного подхода и регулярной практики. Вот несколько ключевых стратегий:\n\n## Планирование подготовки\n\n1. **Составьте план подготовки**: Разделите весь материал на темы и распределите их по неделям до экзамена.\n\n2. **Регулярность важнее продолжительности**: Лучше заниматься по 1-2 часа каждый день, чем по 10 часов раз в неделю.\n\n## Работа с теорией\n\n1. **Структурируйте знания**: Создавайте краткие конспекты с основными формулами и теоремами.\n\n2. **Используйте визуализацию**: Для геометрических задач рисуйте чертежи, для функций - графики.\n\n## Практика решения задач\n\n1. **Начинайте с простого**: Сначала решайте базовые задачи, постепенно переходя к более сложным.\n\n2. **Решайте задания прошлых лет**: Это поможет понять формат и уровень сложности экзамена.\n\n3. **Таймируйте себя**: Практикуйтесь в решении задач на время, чтобы научиться укладываться в отведенные на экзамене минуты.\n\n## Анализ ошибок\n\n1. **Ведите журнал ошибок**: Записывайте задачи, в которых допустили ошибки, и правильное решение.\n\n2. **Регулярно возвращайтесь к сложным темам**: Периодически повторяйте материал, который вызывает затруднения.\n\n## Психологическая подготовка\n\n1. **Практикуйте тестовый режим**: Регулярно выполняйте полные тесты в условиях, приближенных к экзаменационным.\n\n2. **Управляйте стрессом**: Освойте техники релаксации и концентрации внимания.'
                },
                {
                  id: 'l3',
                  title: 'Вводный тест для определения уровня',
                  description: 'Проверка начальных знаний по предмету',
                  duration: '30 мин',
                  type: 'test',
                  completed: true,
                  test_id: 't1'
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
                  description: 'Основные числовые множества и их свойства',
                  duration: '35 мин',
                  type: 'video',
                  completed: true,
                  video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                  content: 'В математике различают несколько основных числовых множеств:\n\n## Натуральные числа (N)\n\nНатуральные числа используются для счёта предметов: 1, 2, 3, 4, 5, ...\n\nСвойства натуральных чисел:\n- Замкнутость относительно сложения и умножения\n- Существование наименьшего элемента (1)\n- Отсутствие наибольшего элемента\n\n## Целые числа (Z)\n\nЦелые числа включают натуральные числа, нуль и отрицательные целые числа: ..., -3, -2, -1, 0, 1, 2, 3, ...\n\nСвойства целых чисел:\n- Замкнутость относительно сложения, вычитания и умножения\n- Отсутствие наименьшего и наибольшего элементов\n\n## Рациональные числа (Q)\n\nРациональные числа — это числа, которые можно представить в виде дроби m/n, где m — целое число, а n — натуральное число: 1/2, 3/4, -5/3, 7/1 и т.д.\n\nСвойства рациональных чисел:\n- Замкнутость относительно четырех арифметических операций (кроме деления на ноль)\n- Между любыми двумя рациональными числами существует бесконечно много рациональных чисел\n\n## Иррациональные числа\n\nИррациональные числа нельзя представить в виде конечной или периодической десятичной дроби: √2, π, e и т.д.\n\n## Действительные числа (R)\n\nДействительные числа объединяют рациональные и иррациональные числа.\n\nСвойства действительных чисел:\n- Полнота (отсутствие "пробелов" на числовой прямой)\n- Непрерывность\n- Плотность (между любыми двумя числами существует бесконечно много чисел)'
                },
                {
                  id: 'l5',
                  title: 'Степени и корни',
                  description: 'Правила работы со степенями и корнями',
                  duration: '40 мин',
                  type: 'video',
                  completed: true,
                  video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                  content: '## Степени\n\nСтепень числа a с натуральным показателем n обозначается a^n и определяется как произведение n множителей, каждый из которых равен a:\n\na^n = a × a × ... × a (n раз)\n\n### Основные свойства степеней:\n\n1. a^m × a^n = a^(m+n)\n2. a^m ÷ a^n = a^(m-n)\n3. (a^m)^n = a^(m×n)\n4. (a × b)^n = a^n × b^n\n5. (a ÷ b)^n = a^n ÷ b^n\n6. a^0 = 1 (при a ≠ 0)\n7. a^(-n) = 1 ÷ a^n\n\n## Корни\n\nКорень n-й степени из числа a обозначается ⁿ√a и определяется как число b, такое что b^n = a.\n\n### Основные свойства корней:\n\n1. ⁿ√(a × b) = ⁿ√a × ⁿ√b\n2. ⁿ√(a ÷ b) = ⁿ√a ÷ ⁿ√b\n3. ⁿ√a^m = a^(m/n)\n4. (ⁿ√a)^m = a^(m/n) = ⁿ√a^m\n5. ⁿ√(ᵐ√a) = ⁿᵐ√a\n\n### Частные случаи:\n\n- Квадратный корень: √a = ²√a\n- Кубический корень: ³√a\n\n## Рационализация знаменателя\n\nЕсли в знаменателе дроби стоит иррациональное выражение, то иногда полезно преобразовать дробь так, чтобы знаменатель стал рациональным числом. Этот процесс называется рационализацией знаменателя.\n\nПример: 1/(√2) = 1/(√2) × (√2)/(√2) = (√2)/2\n\n## Степень с рациональным показателем\n\nЕсли m и n — целые числа, а n > 0, то a^(m/n) = ⁿ√a^m = (ⁿ√a)^m'
                },
                {
                  id: 'l6',
                  title: 'Многочлены и алгебраические выражения',
                  description: 'Операции с многочленами и преобразования выражений',
                  duration: '45 мин',
                  type: 'video',
                  completed: false,
                  video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                  content: '## Многочлены\n\nМногочлен — это алгебраическое выражение, представляющее сумму одночленов. Общий вид многочлена от одной переменной:\n\nP(x) = a₀ + a₁x + a₂x² + ... + aₙxⁿ\n\nгде a₀, a₁, a₂, ..., aₙ — коэффициенты многочлена, а n — его степень.\n\n### Операции с многочленами\n\n1. **Сложение многочленов**: складываются коэффициенты при одинаковых степенях переменной.\n   (2x² + 3x + 1) + (4x² - 2x + 5) = 6x² + x + 6\n\n2. **Вычитание многочленов**: вычитаются коэффициенты при одинаковых степенях.\n   (7x² + 3x - 2) - (4x² + 5x + 1) = 3x² - 2x - 3\n\n3. **Умножение многочлена на число**: каждый член многочлена умножается на это число.\n   3(2x² - 4x + 5) = 6x² - 12x + 15\n\n4. **Умножение многочленов**: применяется распределительный закон и приводятся подобные члены.\n   (x + 2)(x + 3) = x² + 3x + 2x + 6 = x² + 5x + 6\n\n### Формулы сокращенного умножения\n\n1. (a + b)² = a² + 2ab + b²\n2. (a - b)² = a² - 2ab + b²\n3. (a + b)(a - b) = a² - b²\n4. (a + b)³ = a³ + 3a²b + 3ab² + b³\n5. (a - b)³ = a³ - 3a²b + 3ab² - b³\n\n### Разложение многочленов на множители\n\n1. **Вынесение общего множителя за скобки**:\n   6x² + 9x = 3x(2x + 3)\n\n2. **Группировка**:\n   xy + 2x + 3y + 6 = x(y + 2) + 3(y + 2) = (x + 3)(y + 2)\n\n3. **Применение формул сокращенного умножения**:\n   x² - 25 = x² - 5² = (x + 5)(x - 5)\n\n4. **Теорема Безу**: Если P(a) = 0, то многочлен P(x) делится на (x - a).\n\n### Деление многочленов\n\nДеление многочленов можно выполнять "уголком", аналогично делению чисел в столбик. При делении P(x) на (x - a) частное можно найти, используя схему Горнера.'
                },
                {
                  id: 'l7',
                  title: 'Практическое задание: упрощение выражений',
                  description: 'Практика преобразования алгебраических выражений',
                  duration: '30 мин',
                  type: 'assignment',
                  completed: false,
                  content: '## Практическое задание: упрощение алгебраических выражений\n\nВыполните следующие упражнения, упростив каждое выражение:\n\n### Задание 1: Раскройте скобки и приведите подобные члены\n\n1. 2(3x + 4) - 5(x - 1)\n2. (2a - b)(a + 3b)\n3. (x + 2)² - (x - 3)²\n4. 2(x - 1)² + 3x(x + 2)\n\n### Задание 2: Разложите на множители\n\n1. x² - 9\n2. 4y² - 12y + 9\n3. a³ - 8b³\n4. x² + 6x + 9 - y²\n\n### Задание 3: Упростите дробные выражения\n\n1. (x² - 4)/(x - 2)\n2. (a² - b²)/(a - b) + (a + b)\n3. (1/x + 1/y)/(1/x - 1/y)\n4. (x² + x - 6)/(x² - 9) × (x² - 4)/(x² - x - 6)\n\n### Задание 4: Упростите выражения со степенями\n\n1. (a^3)^2 × a^-5\n2. (2x^-2)^3 × (4x^5)^-1\n3. (a^2b^-3)^2 × (ab^2)^3\n4. (x^3 × y^-2)^-4\n\n### Задание 5: Преобразуйте иррациональные выражения\n\n1. √12 + √27\n2. (3 + √5)(2 - √5)\n3. √8 × √2\n4. (√a - √b)²\n\nПроверьте свои ответы после выполнения заданий и выявите типичные ошибки, которые вы допускаете при преобразовании выражений.'
                },
                {
                  id: 'l8',
                  title: 'Тест по основам алгебры',
                  description: 'Проверка знаний по изученным темам',
                  duration: '25 мин',
                  type: 'test',
                  completed: false,
                  test_id: 't2'
                },
              ],
            },
          ],
        };

        setCourse(mockCourse);
        
        // Set initial lesson
        if (mockCourse.sections.length > 0 && mockCourse.sections[0].lessons.length > 0) {
          const firstSection = mockCourse.sections[0];
          const firstLesson = firstSection.lessons[0];
          setCurrentLesson(firstLesson);
        }
        
        // Calculate progress
        let totalLessons = 0;
        let completedLessons = 0;
        
        mockCourse.sections.forEach(section => {
          totalLessons += section.lessons.length;
          completedLessons += section.lessons.filter(lesson => lesson.completed).length;
        });
        
        const calculatedProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        setProgress(calculatedProgress);
      } catch (error) {
        console.error('Error fetching course:', error);
        toast.error('Ошибка при загрузке курса');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Navigation between lessons
  const navigateToLesson = (sectionIndex: number, lessonIndex: number) => {
    if (!course) return;
    
    const section = course.sections[sectionIndex];
    if (!section) return;
    
    const lesson = section.lessons[lessonIndex];
    if (!lesson) return;
    
    setCurrentSectionIndex(sectionIndex);
    setCurrentLessonIndex(lessonIndex);
    setCurrentLesson(lesson);
  };

  const handleNext = () => {
    if (!course) return;
    
    const currentSection = course.sections[currentSectionIndex];
    
    if (currentLessonIndex < currentSection.lessons.length - 1) {
      // Next lesson in the same section
      navigateToLesson(currentSectionIndex, currentLessonIndex + 1);
    } else if (currentSectionIndex < course.sections.length - 1) {
      // First lesson of the next section
      navigateToLesson(currentSectionIndex + 1, 0);
    }
  };

  const handlePrevious = () => {
    if (!course) return;
    
    if (currentLessonIndex > 0) {
      // Previous lesson in the same section
      navigateToLesson(currentSectionIndex, currentLessonIndex - 1);
    } else if (currentSectionIndex > 0) {
      // Last lesson of the previous section
      const prevSection = course.sections[currentSectionIndex - 1];
      navigateToLesson(currentSectionIndex - 1, prevSection.lessons.length - 1);
    }
  };

  const handleCompleteLesson = () => {
    if (!course || !currentLesson) return;
    
    // In a real app, this would make an API call to update the lesson status
    const updatedSections = [...course.sections];
    const lessonToUpdate = updatedSections[currentSectionIndex].lessons[currentLessonIndex];
    lessonToUpdate.completed = true;
    
    setCourse({
      ...course,
      sections: updatedSections
    });
    
    // Recalculate progress
    let totalLessons = 0;
    let completedLessons = 0;
    
    updatedSections.forEach(section => {
      totalLessons += section.lessons.length;
      completedLessons += section.lessons.filter(lesson => lesson.completed).length;
    });
    
    const calculatedProgress = Math.round((completedLessons / totalLessons) * 100);
    setProgress(calculatedProgress);
    
    toast.success('Урок отмечен как завершенный');
  };

  const hasNextLesson = (): boolean => {
    if (!course) return false;
    
    const currentSection = course.sections[currentSectionIndex];
    
    return (
      currentLessonIndex < currentSection.lessons.length - 1 || 
      currentSectionIndex < course.sections.length - 1
    );
  };

  const hasPreviousLesson = (): boolean => {
    return currentLessonIndex > 0 || currentSectionIndex > 0;
  };

  const getLessonType = (type: string): string => {
    switch (type) {
      case 'video':
        return 'Видеоурок';
      case 'test':
        return 'Тест';
      case 'assignment':
        return 'Практическое задание';
      default:
        return 'Материал';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <Skeleton className="h-8 w-1/3 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <Skeleton className="h-[500px] w-full rounded-lg" />
              </div>
              <div className="lg:col-span-3">
                <Skeleton className="h-[600px] w-full rounded-lg" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16 pb-12 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Курс не найден</h2>
            <p className="text-muted-foreground mb-8">
              Запрашиваемый курс не существует или был удален.
            </p>
            <Button onClick={() => navigate('/courses')}>
              Вернуться к списку курсов
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
      
      <main className="flex-1 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Course header */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <Button
                variant="outline"
                size="sm"
                className="mb-2"
                onClick={() => navigate(`/course/${courseId}`)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Вернуться к обзору курса
              </Button>
              <h1 className="text-2xl font-bold">{course.title}</h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
              className="self-end sm:self-auto"
            >
              <List className="h-4 w-4 mr-2" />
              {showSidebar ? 'Скрыть содержание' : 'Показать содержание'}
            </Button>
          </div>
          
          {/* Course content with sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar with lessons list */}
            {showSidebar && (
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardContent className="p-0">
                    <Tabs defaultValue="lessons" className="w-full">
                      <TabsList className="grid grid-cols-1 w-full">
                        <TabsTrigger value="lessons">Содержание курса</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="lessons" className="max-h-[70vh] overflow-y-auto">
                        <div className="py-2 px-2 space-y-1">
                          {course.sections.map((section, sectionIdx) => (
                            <div key={section.id} className="mb-4">
                              <div className="font-medium py-2 px-3">{sectionIdx + 1}. {section.title}</div>
                              
                              <div className="space-y-1 pl-2">
                                {section.lessons.map((lesson, lessonIdx) => (
                                  <Button
                                    key={lesson.id}
                                    variant={
                                      sectionIdx === currentSectionIndex && lessonIdx === currentLessonIndex
                                        ? "default"
                                        : "ghost"
                                    }
                                    size="sm"
                                    className={`w-full justify-start text-left h-auto py-2 ${
                                      lesson.completed ? "text-green-600 font-medium" : ""
                                    }`}
                                    onClick={() => navigateToLesson(sectionIdx, lessonIdx)}
                                  >
                                    <div className="truncate">
                                      <span className="mr-1">{lessonIdx + 1}.</span>
                                      <span className="truncate">{lesson.title}</span>
                                    </div>
                                  </Button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Main lesson content */}
            <div className={`${showSidebar ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
              <div className="bg-white dark:bg-gray-950 rounded-lg border border-border">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-muted-foreground">
                        {getLessonType(currentLesson.type)}
                      </span>
                      <h2 className="text-xl font-semibold">
                        {currentLesson.title}
                      </h2>
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {currentLesson.duration}
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <LessonContent
                    lesson={currentLesson}
                    onComplete={handleCompleteLesson}
                    onNext={hasNextLesson() ? handleNext : undefined}
                    onPrevious={hasPreviousLesson() ? handlePrevious : undefined}
                    progress={progress}
                    hasNext={hasNextLesson()}
                    hasPrevious={hasPreviousLesson()}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CourseLearn;
