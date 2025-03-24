
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Test, Question } from '@/models/Course';

const TakeTest = () => {
  const navigate = useNavigate();
  const { testId, courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState<number>(0); // seconds
  const [testStarted, setTestStarted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Format time in MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Fetch test data
  useEffect(() => {
    const fetchTestData = async () => {
      setLoading(true);
      try {
        // This would be a real API call in production
        // const response = await fetch(`/api/tests/${testId}`);
        // const data = await response.json();
        
        // Mock data for now
        const mockTest: Test = {
          id: 1,
          title: 'Контрольный тест по алгебре',
          description: 'Проверка знаний по линейным и квадратным уравнениям',
          time_limit: 30, // 30 minutes
          passing_score: 70,
          course_id: 1
        };
        
        const mockQuestions: Question[] = [
          {
            id: 1,
            question: 'Решите уравнение: 2x + 5 = 15',
            options: ['x = 5', 'x = 10', 'x = 7.5', 'x = 5.5'],
            correct_answer: 0, // Correct answer is "x = 5"
            points: 1
          },
          {
            id: 2,
            question: 'Найдите значение выражения: 3(2 + 4) - 5',
            options: ['13', '18', '13.5', '14'],
            correct_answer: 1, // Correct answer is "18"
            points: 1
          },
          {
            id: 3,
            question: 'Найдите корни квадратного уравнения: x² - 5x + 6 = 0',
            options: ['x₁ = 2, x₂ = 3', 'x₁ = -2, x₂ = -3', 'x₁ = 6, x₂ = -1', 'x₁ = 1, x₂ = 6'],
            correct_answer: 0, // Correct answer is "x₁ = 2, x₂ = 3"
            points: 2
          },
          {
            id: 4,
            question: 'Решите систему уравнений: { x + y = 5, x - y = 1 }',
            options: ['x = 3, y = 2', 'x = 2, y = 3', 'x = 4, y = 1', 'x = 1, y = 4'],
            correct_answer: 0, // Correct answer is "x = 3, y = 2"
            points: 2
          },
          {
            id: 5,
            question: 'Вычислите: (2³)²',
            options: ['32', '64', '36', '8'],
            correct_answer: 1, // Correct answer is "64"
            points: 1
          }
        ];
        
        setTest(mockTest);
        setQuestions(mockQuestions);
        // Set initial time from test data (convert minutes to seconds)
        setTimeLeft(mockTest.time_limit * 60);
      } catch (error) {
        console.error('Failed to fetch test data:', error);
        toast.error('Не удалось загрузить тест');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTestData();
    
    // Clean up timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [testId]);
  
  // Start timer when test starts
  useEffect(() => {
    if (testStarted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Time's up, auto-submit the test
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            submitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [testStarted, timeLeft]);
  
  const startTest = () => {
    setTestStarted(true);
  };
  
  const handleAnswer = (questionId: number, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };
  
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const calculateProgress = () => {
    const answeredCount = Object.keys(answers).length;
    return (answeredCount / questions.length) * 100;
  };
  
  const calculateScore = () => {
    let totalPoints = 0;
    let earnedPoints = 0;
    
    questions.forEach(question => {
      totalPoints += question.points;
      if (answers[question.id] === question.correct_answer) {
        earnedPoints += question.points;
      }
    });
    
    return {
      earnedPoints,
      totalPoints,
      percentage: Math.round((earnedPoints / totalPoints) * 100)
    };
  };
  
  const submitTest = async () => {
    if (submitting) return;
    
    setSubmitting(true);
    try {
      const score = calculateScore();
      
      // This would be a real API call in production
      // const response = await fetch(`/api/tests/${testId}/submit`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     answers,
      //     score: score.percentage,
      //     time_spent: test!.time_limit * 60 - timeLeft
      //   }),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to submit test');
      // }
      
      // Stop the timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Mock successful submission
      toast.success('Тест успешно отправлен!');
      
      // Redirect to results page
      setTimeout(() => {
        navigate(`/course/${courseId}/test/${testId}/results`);
      }, 1500);
    } catch (error) {
      console.error('Failed to submit test:', error);
      toast.error('Не удалось отправить ответы');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container max-w-4xl text-center py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-secondary rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-secondary rounded w-2/3 mx-auto mb-8"></div>
              <div className="h-64 bg-secondary rounded w-full mx-auto"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!testStarted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{test?.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{test?.description}</p>
                
                <div className="border-t border-b py-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Время на выполнение:</span>
                    <span className="font-medium">{test?.time_limit} минут</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Количество вопросов:</span>
                    <span className="font-medium">{questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Проходной балл:</span>
                    <span className="font-medium">{test?.passing_score}%</span>
                  </div>
                </div>
                
                <div className="bg-primary/10 p-4 rounded-md">
                  <h3 className="font-semibold mb-2">Инструкции:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Внимательно прочитайте каждый вопрос перед тем, как ответить.</li>
                    <li>Вы можете перемещаться между вопросами.</li>
                    <li>Таймер начнется, как только вы нажмете "Начать тест".</li>
                    <li>Тест автоматически завершится, когда истечет время.</li>
                    <li>Нажмите "Завершить тест", когда ответите на все вопросы.</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={startTest}>
                  Начать тест
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{test?.title}</h1>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className={`font-mono text-lg ${timeLeft < 60 ? 'text-red-500 animate-pulse' : ''}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex justify-between">
                    <span>Вопрос {currentQuestionIndex + 1} из {questions.length}</span>
                    <span className="text-sm text-muted-foreground">
                      {currentQuestion.points} {currentQuestion.points === 1 ? 'балл' : currentQuestion.points < 5 ? 'балла' : 'баллов'}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-lg">{currentQuestion.question}</p>
                  
                  <RadioGroup 
                    value={answers[currentQuestion.id]?.toString() || ''} 
                    onValueChange={(value) => handleAnswer(currentQuestion.id, parseInt(value))}
                  >
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-start space-x-2 p-2 hover:bg-secondary/50 rounded-md">
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label 
                          htmlFor={`option-${index}`} 
                          className="flex-1 cursor-pointer"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={goToPreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    Предыдущий
                  </Button>
                  {currentQuestionIndex < questions.length - 1 ? (
                    <Button onClick={goToNextQuestion}>
                      Следующий
                    </Button>
                  ) : (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button>Завершить тест</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Завершить тест?</AlertDialogTitle>
                          <AlertDialogDescription>
                            {Object.keys(answers).length < questions.length ? (
                              <div className="flex items-center text-amber-500 gap-2 mb-2">
                                <AlertTriangle className="h-5 w-5" />
                                <span>Вы ответили не на все вопросы!</span>
                              </div>
                            ) : (
                              <div className="flex items-center text-green-500 gap-2 mb-2">
                                <CheckCircle2 className="h-5 w-5" />
                                <span>Вы ответили на все вопросы.</span>
                              </div>
                            )}
                            <p>После отправки вы не сможете изменить свои ответы.</p>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Отмена</AlertDialogCancel>
                          <AlertDialogAction onClick={submitTest} disabled={submitting}>
                            {submitting ? 'Отправка...' : 'Отправить'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Прогресс</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={calculateProgress()} className="h-2" />
                  <p className="text-sm text-center text-muted-foreground">
                    {Object.keys(answers).length} из {questions.length} вопросов отвечено
                  </p>
                  
                  <div className="grid grid-cols-5 gap-2 mt-4">
                    {questions.map((_, index) => (
                      <Button
                        key={index}
                        variant={currentQuestionIndex === index ? "default" : answers[questions[index].id] !== undefined ? "outline" : "secondary"}
                        className="h-10 w-10 p-0"
                        onClick={() => setCurrentQuestionIndex(index)}
                      >
                        {index + 1}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      Завершить тест
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Завершить тест?</AlertDialogTitle>
                      <AlertDialogDescription>
                        {Object.keys(answers).length < questions.length ? (
                          <div className="flex items-center text-amber-500 gap-2 mb-2">
                            <AlertTriangle className="h-5 w-5" />
                            <span>Вы ответили не на все вопросы!</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-green-500 gap-2 mb-2">
                            <CheckCircle2 className="h-5 w-5" />
                            <span>Вы ответили на все вопросы.</span>
                          </div>
                        )}
                        <p>После отправки вы не сможете изменить свои ответы.</p>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Отмена</AlertDialogCancel>
                      <AlertDialogAction onClick={submitTest} disabled={submitting}>
                        {submitting ? 'Отправка...' : 'Отправить'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TakeTest;
