
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  GraduationCap, 
  ArrowLeft,
  FileText,
  BarChart4
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const TestResults = () => {
  const { courseId, testId } = useParams();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any>(null);
  
  useEffect(() => {
    // In a real app, this would fetch real test results from an API
    const fetchResults = async () => {
      setLoading(true);
      try {
        // Mock data for demonstration
        setResults({
          testId,
          testTitle: 'Контрольный тест по алгебре',
          courseId,
          courseTitle: 'Алгебра: основные концепции',
          score: 75,
          passingScore: 70,
          timeTaken: '14:23',
          maxTime: '30:00',
          totalQuestions: 10,
          correctAnswers: 7,
          incorrectAnswers: 3,
          questions: [
            {
              question: 'Решите уравнение: 2x + 5 = 15',
              userAnswer: 'x = 5',
              correctAnswer: 'x = 5',
              isCorrect: true,
              explanation: 'Вычитаем 5 из обеих частей: 2x = 10. Делим обе части на 2: x = 5'
            },
            {
              question: 'Найдите значение выражения: 3(2 + 4) - 5',
              userAnswer: '13',
              correctAnswer: '13',
              isCorrect: true,
              explanation: '3(6) - 5 = 18 - 5 = 13'
            },
            {
              question: 'Найдите корни квадратного уравнения: x² - 5x + 6 = 0',
              userAnswer: 'x₁ = 3, x₂ = 2',
              correctAnswer: 'x₁ = 2, x₂ = 3',
              isCorrect: true,
              explanation: 'Используя формулу квадратного уравнения или факторизацию, получаем x = 2 и x = 3'
            },
            {
              question: 'Вычислите: (2³)²',
              userAnswer: '32',
              correctAnswer: '64',
              isCorrect: false,
              explanation: '(2³)² = 8² = 64'
            },
            {
              question: 'Решите систему уравнений: { x + y = 5, x - y = 1 }',
              userAnswer: 'x = 2, y = 3',
              correctAnswer: 'x = 3, y = 2',
              isCorrect: false,
              explanation: 'Из второго уравнения: x = 1 + y. Подставляем в первое: (1 + y) + y = 5, 1 + 2y = 5, 2y = 4, y = 2. Тогда x = 1 + 2 = 3.'
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching test results:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [courseId, testId]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-secondary rounded w-1/3"></div>
              <div className="h-4 bg-secondary rounded w-2/3"></div>
              <div className="h-64 bg-secondary rounded w-full"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!results) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Результаты не найдены</h1>
            <p className="text-muted-foreground mb-6">Не удалось найти результаты для данного теста</p>
            <Button asChild>
              <Link to={`/course/${courseId}`}>Вернуться к курсу</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const isPassed = results.score >= results.passingScore;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <Button variant="outline" asChild className="mb-4">
              <Link to={`/course/${courseId}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Вернуться к курсу
              </Link>
            </Button>
            <h1 className="text-2xl font-bold mb-1">{results.testTitle}</h1>
            <p className="text-muted-foreground">Результаты теста</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader className="bg-muted/40 pb-4">
                  <CardTitle>Итоговый результат</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <div className={`inline-flex items-center justify-center rounded-full p-4 ${
                      isPassed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {isPassed ? (
                        <CheckCircle2 className="h-12 w-12 text-green-500" />
                      ) : (
                        <XCircle className="h-12 w-12 text-red-500" />
                      )}
                    </div>
                    
                    <h2 className="text-2xl font-bold mt-4">
                      {isPassed ? 'Тест пройден!' : 'Тест не пройден'}
                    </h2>
                    
                    <div className="mt-4 mb-6">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="text-3xl font-bold">{results.score}%</span>
                        <span className="text-sm text-muted-foreground">
                          (проходной балл: {results.passingScore}%)
                        </span>
                      </div>
                      <Progress 
                        value={results.score} 
                        className="h-3 w-64 mx-auto"
                        indicatorClassName={isPassed ? "bg-green-500" : "bg-red-500"}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Затраченное время</p>
                        <p className="font-medium">{results.timeTaken} из {results.maxTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart4 className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Правильные ответы</p>
                        <p className="font-medium">{results.correctAnswers} из {results.totalQuestions}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader className="bg-muted/40 pb-4">
                  <CardTitle>Информация</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Курс</p>
                      <p className="font-medium">{results.courseTitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Всего вопросов</p>
                      <p className="font-medium">{results.totalQuestions}</p>
                    </div>
                  </div>
                  
                  <Button asChild className="w-full">
                    <Link to={`/course/${courseId}/tests/${testId}`}>
                      Пройти еще раз
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Детали ответов</h2>
            
            {results.questions.map((q: any, idx: number) => (
              <Card key={idx} className={q.isCorrect ? "border-green-200" : "border-red-200"}>
                <CardHeader className={`pb-2 ${q.isCorrect ? "bg-green-50/50" : "bg-red-50/50"}`}>
                  <div className="flex items-start gap-2">
                    {q.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-1 shrink-0" />
                    )}
                    <div>
                      <CardTitle className="text-base">Вопрос {idx + 1}</CardTitle>
                      <p className="text-sm font-normal mt-1">{q.question}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Ваш ответ:</p>
                    <p className={q.isCorrect ? "font-medium text-green-700" : "font-medium text-red-700"}>
                      {q.userAnswer}
                    </p>
                  </div>
                  
                  {!q.isCorrect && (
                    <div>
                      <p className="text-sm text-muted-foreground">Правильный ответ:</p>
                      <p className="font-medium text-green-700">{q.correctAnswer}</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Объяснение:</p>
                    <p className="text-sm">{q.explanation}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TestResults;
