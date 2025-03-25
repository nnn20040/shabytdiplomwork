
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, Calendar, Clock, CheckCircle, FileText, ArrowUpRight } from 'lucide-react';

const Tests = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // Mock data for tests
  const availableTests = [
    {
      id: '1',
      title: 'Квадратные уравнения',
      course: 'Математика для ЕНТ',
      courseId: '1',
      questions: 20,
      duration: 30,
      difficulty: 'Средняя',
      category: 'Математика',
      completed: true,
      score: 85,
      date: '15 мая, 2023',
    },
    {
      id: '2',
      title: 'Казахстан в 20 веке',
      course: 'История Казахстана',
      courseId: '3',
      questions: 25,
      duration: 40,
      difficulty: 'Сложная',
      category: 'История',
      completed: true,
      score: 72,
      date: '12 мая, 2023',
    },
    {
      id: '3',
      title: 'Тригонометрические функции',
      course: 'Математика для ЕНТ',
      courseId: '1',
      questions: 15,
      duration: 25,
      difficulty: 'Сложная',
      category: 'Математика',
      completed: true,
      score: 90,
      date: '10 мая, 2023',
    },
    {
      id: '4',
      title: 'Механика: законы Ньютона',
      course: 'Физика: механика и термодинамика',
      courseId: '2',
      questions: 20,
      duration: 30,
      difficulty: 'Средняя',
      category: 'Физика',
      completed: false,
    },
    {
      id: '5',
      title: 'Казахская грамматика',
      course: 'Казахский язык: грамматика и лексика',
      courseId: '4',
      questions: 30,
      duration: 45,
      difficulty: 'Средняя',
      category: 'Казахский язык',
      completed: false,
    },
  ];
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  const filteredTests = availableTests.filter(test => {
    if (activeTab === 'all') return true;
    if (activeTab === 'completed') return test.completed;
    if (activeTab === 'pending') return !test.completed;
    if (activeTab === test.category.toLowerCase()) return true;
    return false;
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-3xl font-bold">Тесты</h1>
              <p className="text-muted-foreground mt-1">Проверяйте свои знания и отслеживайте прогресс</p>
            </div>
          </div>
          
          <div className={`mb-8 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">Все тесты</TabsTrigger>
                <TabsTrigger value="completed">Пройденные</TabsTrigger>
                <TabsTrigger value="pending">Непройденные</TabsTrigger>
                <TabsTrigger value="математика">Математика</TabsTrigger>
                <TabsTrigger value="физика">Физика</TabsTrigger>
                <TabsTrigger value="история">История</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTests.map(test => (
                    <Card key={test.id} className="overflow-hidden">
                      <CardHeader className={`${test.completed ? 'bg-green-50 dark:bg-green-950/20' : 'bg-blue-50 dark:bg-blue-950/20'} pb-4`}>
                        <div className="flex justify-between items-start">
                          <Badge variant="outline" className={`${test.completed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {test.completed ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Пройден
                              </>
                            ) : (
                              <>
                                <Clock className="h-3 w-3 mr-1" />
                                Доступен
                              </>
                            )}
                          </Badge>
                          <Badge variant="outline" className="bg-gray-100 text-gray-800">
                            {test.category}
                          </Badge>
                        </div>
                        <CardTitle className="mt-2">{test.title}</CardTitle>
                        <CardDescription>{test.course}</CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-sm">
                            <div className="text-muted-foreground">Вопросов</div>
                            <div className="font-medium">{test.questions}</div>
                          </div>
                          <div className="text-sm">
                            <div className="text-muted-foreground">Время</div>
                            <div className="font-medium">{test.duration} минут</div>
                          </div>
                          <div className="text-sm">
                            <div className="text-muted-foreground">Сложность</div>
                            <div className="font-medium">{test.difficulty}</div>
                          </div>
                          {test.completed && (
                            <div className="text-sm">
                              <div className="text-muted-foreground">Результат</div>
                              <div className={`font-medium ${test.score >= 80 ? 'text-green-600' : test.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                                {test.score}%
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {test.completed && (
                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Результат</span>
                              <span>{test.score}%</span>
                            </div>
                            <Progress value={test.score} className="h-2" />
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center">
                          {test.completed ? (
                            <Link to={`/course/${test.courseId}/test/${test.id}/results`}>
                              <Button variant="outline">
                                <BarChart3 className="h-4 w-4 mr-2" />
                                Результаты
                              </Button>
                            </Link>
                          ) : (
                            <Link to={`/course/${test.courseId}/test/${test.id}`}>
                              <Button>
                                <FileText className="h-4 w-4 mr-2" />
                                Пройти тест
                              </Button>
                            </Link>
                          )}
                          
                          <div className="text-xs text-muted-foreground flex items-center">
                            {test.completed ? (
                              <>
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>{test.date}</span>
                              </>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-xs" 
                                asChild
                              >
                                <Link to={`/course/${test.courseId}`}>
                                  <span>К курсу</span>
                                  <ArrowUpRight className="h-3 w-3 ml-1" />
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {filteredTests.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Тесты не найдены</h2>
                    <p className="text-muted-foreground mb-6">
                      В выбранной категории нет доступных тестов
                    </p>
                    <Button onClick={() => setActiveTab('all')}>
                      Посмотреть все тесты
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Tests;
