
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Lesson } from '@/models/Course';
import { FileText, Video, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface LessonContentProps {
  lesson: Lesson;
}

const LessonContent = ({ lesson }: LessonContentProps) => {
  const [activeTab, setActiveTab] = useState('video');
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Function to get a valid video URL or use a fallback
  const getVideoUrl = () => {
    if (!lesson.video_url || lesson.video_url.trim() === '') {
      return 'https://www.youtube.com/embed/jS4aFq5-91M'; // Math video fallback
    }
    
    // If URL is from YouTube but not in embed format
    if (lesson.video_url.includes('youtube.com/watch?v=')) {
      const videoId = lesson.video_url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    return lesson.video_url;
  };

  // Videos by lesson type
  const getVideoByLessonTitle = () => {
    const title = lesson.title.toLowerCase();
    
    if (title.includes('введение')) {
      return 'https://www.youtube.com/embed/g8BZvIgI2XM'; // Introduction to Algebra
    } else if (title.includes('линейн')) {
      return 'https://www.youtube.com/embed/kwh4SD1ToFc'; // Linear equations
    } else if (title.includes('квадрат')) {
      return 'https://www.youtube.com/embed/ZBalWWHYFQc'; // Quadratic equations
    } else if (title.includes('тригоном')) {
      return 'https://www.youtube.com/embed/O8TgWE-S4_Y'; // Trigonometry
    } else if (title.includes('логарифм')) {
      return 'https://www.youtube.com/embed/DcBJUbLx2HU'; // Logarithms
    } else {
      return 'https://www.youtube.com/embed/jS4aFq5-91M'; // General math video
    }
  };

  useEffect(() => {
    // Reset video error state when lesson changes
    setVideoError(false);
    setVideoLoaded(false);
  }, [lesson]);

  const handleVideoLoad = () => {
    setVideoLoaded(true);
    toast.success("Видео загружено успешно");
  };

  const handleVideoError = () => {
    console.error("Video failed to load:", lesson.video_url);
    setVideoError(true);
    toast.error("Не удалось загрузить видео. Использую запасной вариант.");
  };

  return (
    <Card className="p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Видео
          </TabsTrigger>
          <TabsTrigger value="theory" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Теория
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="video" className="mt-0">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">{lesson.title}</h2>
            <p className="text-muted-foreground">{lesson.description}</p>
          </div>
          
          <AspectRatio ratio={16 / 9} className="bg-muted rounded-md overflow-hidden">
            {videoError ? (
              <div className="relative w-full h-full">
                <div className="absolute top-4 left-4 right-4 z-10 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-3 rounded-md">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                    <p className="text-sm">Используется альтернативное видео для этой темы</p>
                  </div>
                </div>
                <iframe
                  src={getVideoByLessonTitle()}
                  title={`${lesson.title} (альтернативное видео)`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                  onLoad={handleVideoLoad}
                />
              </div>
            ) : (
              <iframe
                src={getVideoUrl()}
                title={lesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                onLoad={handleVideoLoad}
                onError={handleVideoError}
              />
            )}
            
            {!videoLoaded && !videoError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            )}
          </AspectRatio>
        </TabsContent>
        
        <TabsContent value="theory" className="mt-0">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h2 className="text-xl font-bold mb-4">{lesson.title} - Теоретический материал</h2>
            
            <div className="space-y-4">
              <h3>Основные понятия</h3>
              {lesson.title.toLowerCase().includes('введение') ? (
                <div>
                  <p>Алгебра — это раздел математики, который изучает операции с абстрактными символами и числами. В отличие от арифметики, где мы работаем с конкретными числами, в алгебре мы используем переменные, которые могут принимать различные значения.</p>
                  
                  <p>Ключевые понятия, которые мы будем изучать в этом курсе:</p>
                  <ul>
                    <li><strong>Переменные</strong> — символы, обычно буквы латинского алфавита (x, y, z), которые могут принимать различные числовые значения.</li>
                    <li><strong>Выражения</strong> — комбинации чисел, переменных и операций над ними.</li>
                    <li><strong>Уравнения</strong> — математические предложения, содержащие знак равенства, где требуется найти значения переменных, при которых это равенство выполняется.</li>
                    <li><strong>Функции</strong> — правила, устанавливающие соответствие между элементами двух множеств.</li>
                  </ul>
                </div>
              ) : lesson.title.toLowerCase().includes('линейн') ? (
                <div>
                  <p>Линейное уравнение — это уравнение, в котором переменная находится в первой степени. Общий вид линейного уравнения с одной переменной:</p>
                  <p className="bg-secondary p-2 rounded text-center"><strong>ax + b = 0</strong></p>
                  <p>где a и b — некоторые числа, причем a ≠ 0.</p>
                  
                  <p>Решение линейного уравнения:</p>
                  <p>Если a ≠ 0, то уравнение имеет единственное решение: <strong>x = -b/a</strong></p>
                  
                  <h4>Пример:</h4>
                  <p>Решить уравнение 3x - 6 = 0</p>
                  <p>3x = 6</p>
                  <p>x = 2</p>
                  
                  <p>Линейные уравнения используются во многих областях: от физики до экономики.</p>
                </div>
              ) : lesson.title.toLowerCase().includes('квадрат') ? (
                <div>
                  <p>Квадратное уравнение — это уравнение вида:</p>
                  <p className="bg-secondary p-2 rounded text-center"><strong>ax² + bx + c = 0</strong></p>
                  <p>где a, b, c — некоторые числа, причем a ≠ 0.</p>
                  
                  <p>Для решения квадратных уравнений используется дискриминант:</p>
                  <p className="bg-secondary p-2 rounded text-center"><strong>D = b² - 4ac</strong></p>
                  
                  <p>В зависимости от значения дискриминанта, уравнение имеет:</p>
                  <ul>
                    <li>Если D > 0, уравнение имеет два различных корня: x₁ = (-b + √D)/(2a) и x₂ = (-b - √D)/(2a)</li>
                    <li>Если D = 0, уравнение имеет один корень кратности 2: x = -b/(2a)</li>
                    <li>Если D < 0, уравнение не имеет действительных корней</li>
                  </ul>
                </div>
              ) : (
                <p>
                  {lesson.content || `Теоретический материал по теме "${lesson.title}". 
                  Здесь представлено подробное объяснение темы, включая определения, формулы, 
                  правила и примеры решения задач.`}
                </p>
              )}
              
              <h3>Формулы и определения</h3>
              <ul>
                <li>Определение 1: важное понятие и его объяснение</li>
                <li>Формула 1: математическое выражение с пояснением</li>
                <li>Правило 1: важное правило для запоминания</li>
              </ul>
              
              <h3>Примеры</h3>
              <p>Пример 1: Подробное решение типовой задачи с объяснением каждого шага.</p>
              <p>Пример 2: Еще один пример с другим подходом к решению.</p>
              
              <h3>Важно помнить</h3>
              <ul>
                <li>Ключевой момент 1 для запоминания</li>
                <li>Ключевой момент 2 для запоминания</li>
                <li>Ключевой момент 3 для запоминания</li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default LessonContent;
