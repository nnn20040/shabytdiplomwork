import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart as BarChartIcon, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  ArrowUpRight,
  Download
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { Test, TestResult } from '@/models/Course';

const TestResults = () => {
  const { courseId, testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState<Test | null>(null);
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Prepare data for charts
  const scoreDistribution = [
    { range: '0-20%', count: 2 },
    { range: '21-40%', count: 5 },
    { range: '41-60%', count: 8 },
    { range: '61-80%', count: 12 },
    { range: '81-100%', count: 7 }
  ];
  
  const timeDistribution = [
    { range: '<5 мин', count: 3 },
    { range: '5-10 мин', count: 8 },
    { range: '10-15 мин', count: 15 },
    { range: '15-20 мин', count: 6 },
    { range: '>20 мин', count: 2 }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Mock API call to fetch test details and results
        setTimeout(() => {
          const mockTest: Test = {
            id: testId ? testId : '',
            title: 'Тест по линейным уравнениям',
            description: 'Проверка знаний по теме "Линейные уравнения"',
            timeLimit: 30,
            time_limit: 30,
            passingScore: 70,
            passing_score: 70,
            course_id: courseId ? Number(courseId) : 0,
            lesson_id: 2,
            created_at: '2023-03-15T10:00:00Z',
            updated_at: '2023-03-15T10:00:00Z',
            questions: []
          };
          
          const mockResults: TestResult[] = [
            {
              id: 1,
              student_id: 101,
              testId: testId ? testId : '',
              test_id: testId ? Number(testId) : 0,
              score: 85,
              answers: [
                { questionId: 1, userAnswer: "2", correct: true },
                { questionId: 2, userAnswer: "1", correct: true },
                { questionId: 3, userAnswer: "0", correct: false }
              ],
              completed: true,
              time_spent: 845, // seconds
              created_at: '2023-03-16T10:15:30Z',
              completedAt: '2023-03-16T10:15:30Z',
              passed: true
            },
            {
              id: 2,
              student_id: 102,
              testId: testId ? testId : '',
              test_id: testId ? Number(testId) : 0,
              score: 75,
              answers: [
                { questionId: 1, userAnswer: "2", correct: true },
                { questionId: 2, userAnswer: "0", correct: false },
                { questionId: 3, userAnswer: "0", correct: true }
              ],
              completed: true,
              time_spent: 1290, // seconds
              created_at: '2023-03-16T11:22:45Z',
              completedAt: '2023-03-16T11:22:45Z',
              passed: true
            },
            {
              id: 3,
              student_id: 103,
              testId: testId ? testId : '',
              test_id: testId ? Number(testId) : 0,
              score: 50,
              answers: [
                { questionId: 1, userAnswer: "1", correct: false },
                { questionId: 2, userAnswer: "1", correct: true },
                { questionId: 3, userAnswer: "2", correct: false }
              ],
              completed: true,
              time_spent: 900, // seconds
              created_at: '2023-03-16T13:10:20Z',
              completedAt: '2023-03-16T13:10:20Z',
              passed: false
            },
            {
              id: 4,
              student_id: 104,
              testId: testId ? testId : '',
              test_id: testId ? Number(testId) : 0,
              score: 90,
              answers: [
                { questionId: 1, userAnswer: "2", correct: true },
                { questionId: 2, userAnswer: "1", correct: true },
                { questionId: 3, userAnswer: "0", correct: true }
              ],
              completed: true,
              time_spent: 685, // seconds
              created_at: '2023-03-16T14:05:12Z',
              completedAt: '2023-03-16T14:05:12Z',
              passed: true
            },
            {
              id: 5,
              student_id: 105,
              testId: testId ? testId : '',
              test_id: testId ? Number(testId) : 0,
              score: 60,
              answers: [
                { questionId: 1, userAnswer: "2", correct: true },
                { questionId: 2, userAnswer: "0", correct: false },
                { questionId: 3, userAnswer: "2", correct: false }
              ],
              completed: true,
              time_spent: 1130, // seconds
              created_at: '2023-03-16T15:18:33Z',
              completedAt: '2023-03-16T15:18:33Z',
              passed: false
            }
          ];
          
          setTest(mockTest);
          setResults(mockResults);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch test results:', error);
        toast.error('Не удалось загрузить результаты теста');
        setLoading(false);
      }
    };
    
    if (courseId && testId) {
      fetchData();
    }
  }, [courseId, testId]);

  const formatTime = (seconds: number | string) => {
    if (typeof seconds === 'string') {
      seconds = parseInt(seconds, 10);
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const calculateAvgScore = () => {
    if (results.length === 0) return 0;
    const sum = results.reduce((acc, result) => acc + result.score, 0);
    return Math.round(sum / results.length);
  };
  
  const calculatePassRate = () => {
    if (results.length === 0) return '0%';
    const passed = results.filter(result => result.passed).length;
    return `${Math.round((passed / results.length) * 100)}%`;
  };
  
  const calculateAvgTime = () => {
    if (results.length === 0) return '0:00';
    let sum = 0;
    
    for (const result of results) {
      if (typeof result.time_spent === 'number') {
        sum += result.time_spent;
      } else if (typeof result.time_spent === 'string') {
        sum += parseInt(result.time_spent, 10) || 0;
      }
    }
    
    return formatTime(Math.round(sum / results.length));
  };

  const downloadResults = () => {
    toast.success('Результаты теста успешно скачаны');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container">
            <p className="text-center">Загрузка результатов теста...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container">
            <p className="text-center">Тест не найден</p>
            <div className="flex justify-center mt-4">
              <Button onClick={() => navigate(`/course/${courseId}/manage`)}>
                Вернуться к управлению курсом
              </Button>
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
      
      <main className="flex-1 py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">{test.title} - Результаты</h1>
              <p className="text-muted-foreground mt-1">{test.description}</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => navigate(`/course/${courseId}/test/${testId}/edit`)}
              >
                Редактировать тест
              </Button>
              <Button onClick={() => toast.success('Результаты теста успешно скачаны')}>
                <Download className="h-4 w-4 mr-2" />
                Скачать отчет
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Студентов прошло</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-primary mr-2" />
                  <span className="text-2xl font-bold">{results.length}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Средний балл</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <BarChartIcon className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-2xl font-bold">{calculateAvgScore()}%</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Успешность</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-2xl font-bold">{calculatePassRate()}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Среднее время</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="text-2xl font-bold">{calculateAvgTime()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Распределение баллов</CardTitle>
                <CardDescription>Количество студентов по диапазонам баллов</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scoreDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Распределение времени</CardTitle>
                <CardDescription>Время, ��атраченное на прохождение теста</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timeDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#22c55e" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Индивидуальные результаты</CardTitle>
              <CardDescription>Детальная информация о результатах каждого студента</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Студент</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Время</TableHead>
                    <TableHead>Балл</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map(result => {
                    // Mock student data
                    const studentName = (() => {
                      switch (result.student_id) {
                        case 101: return 'Иван Иванов';
                        case 102: return 'Мария Петрова';
                        case 103: return 'Алексей Смирнов';
                        case 104: return 'Елена Сидорова';
                        default: return 'Дмитрий Козлов';
                      }
                    })();
                    
                    const date = new Date(result.created_at || '').toLocaleDateString('ru-RU');
                    
                    return (
                      <TableRow key={result.id}>
                        <TableCell>{result.id}</TableCell>
                        <TableCell>{studentName}</TableCell>
                        <TableCell>{date}</TableCell>
                        <TableCell>{typeof result.time_spent !== undefined ? formatTime(result.time_spent || 0) : '0:00'}</TableCell>
                        <TableCell>{result.score}%</TableCell>
                        <TableCell>
                          {result.passed ? (
                            <Badge className="bg-green-500">Пройден</Badge>
                          ) : (
                            <Badge variant="destructive">Не пройден</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <ArrowUpRight className="h-4 w-4 mr-1" /> Детали
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TestResults;
