
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  GraduationCap,
} from 'lucide-react';
import { getAvailableTests, getTestCategories } from '@/services/testService';
import { toast } from 'sonner';

const TestManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();
  
  const { data: tests = [], isLoading } = useQuery({
    queryKey: ['tests'],
    queryFn: getAvailableTests
  });
  
  const { data: categories = [] } = useQuery({
    queryKey: ['testCategories'],
    queryFn: getTestCategories
  });
  
  // Filter tests based on search term and active tab
  const filteredTests = tests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          test.course.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (activeTab === 'all') return true;
    return test.category.toLowerCase() === activeTab.toLowerCase();
  });

  const handleDeleteTest = (testId: string) => {
    // In a real application, you would call an API endpoint to delete the test
    toast.success('Тест успешно удален');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Управление тестами</h1>
              <p className="text-muted-foreground mt-1">Создавайте, редактируйте и анализируйте тесты</p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Button onClick={() => navigate('/create-test')} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Создать тест
              </Button>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск тестов..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6 overflow-x-auto flex w-full justify-start md:justify-center gap-1 pb-1 no-scrollbar">
                <TabsTrigger value="all">Все тесты</TabsTrigger>
                {categories.map(category => (
                  <TabsTrigger key={category.id} value={category.id}>{category.name}</TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-6">
                {isLoading ? (
                  <p className="text-center py-8">Загрузка тестов...</p>
                ) : filteredTests.length > 0 ? (
                  <div className="space-y-4">
                    {filteredTests.map(test => (
                      <Card key={test.id} className="overflow-hidden">
                        <CardHeader className="bg-muted/40 pb-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <CardTitle className="text-xl">{test.title}</CardTitle>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <Link to={`/course/${test.courseId}/tests/${test.id}/results`}>
                                  <GraduationCap className="h-4 w-4 mr-2" />
                                  Результаты
                                </Link>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <Link to={`/course/${test.courseId}/test/${test.id}/edit`}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Редактировать
                                </Link>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteTest(test.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Удалить</span>
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                Курс: <span className="font-medium">{test.course}</span>
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                Длительность: <span className="font-medium">{test.duration} минут</span>
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                Вопросов: <span className="font-medium">{test.questions}</span>
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Тесты не найдены</h2>
                    <p className="text-muted-foreground mb-6">
                      {searchTerm 
                        ? 'Попробуйте изменить параметры поиска' 
                        : 'В выбранной категории нет доступных тестов'}
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

export default TestManagement;
