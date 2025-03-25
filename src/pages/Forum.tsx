
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, MessageCircle, ChevronRight } from 'lucide-react';

const Forum = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Mock forum questions
  const [forumQuestions, setForumQuestions] = useState([
    {
      id: '1',
      title: 'Как подготовиться к математической части ЕНТ за 1 месяц?',
      author: 'Арман Серікұлы',
      course: 'Математика для ЕНТ',
      replies: 8,
      date: '3 дня назад',
      category: 'математика',
      views: 120
    },
    {
      id: '2',
      title: 'Какие исторические даты обязательно нужно знать?',
      author: 'Әсел Кенжебаева',
      course: 'История Казахстана',
      replies: 12,
      date: '5 дней назад',
      category: 'история',
      views: 85
    },
    {
      id: '3',
      title: 'Формулы по физике, которые точно будут на ЕНТ',
      author: 'Данияр Нұрланов',
      course: 'Физика для ЕНТ',
      replies: 5,
      date: '1 неделю назад',
      category: 'физика',
      views: 67
    },
    {
      id: '4',
      title: 'Как быстро выучить казахскую грамматику?',
      author: 'Мадина Сәрсенбаева',
      course: 'Казахский язык',
      replies: 9,
      date: '2 недели назад',
      category: 'казахский язык',
      views: 93
    },
  ]);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  const filteredQuestions = forumQuestions.filter(question => {
    if (searchTerm && !question.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (activeTab !== 'all' && question.category !== activeTab) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-3xl font-bold">Форум</h1>
              <p className="text-muted-foreground mt-1">Обсуждайте вопросы и делитесь знаниями</p>
            </div>
            <div className={`transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Link to="/forum/new">
                <Button className="mt-4 md:mt-0">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Создать обсуждение
                </Button>
              </Link>
            </div>
          </div>
          
          <div className={`mb-8 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input 
                    placeholder="Поиск по обсуждениям..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="mb-6">
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">Все темы</TabsTrigger>
                  <TabsTrigger value="математика">Математика</TabsTrigger>
                  <TabsTrigger value="физика">Физика</TabsTrigger>
                  <TabsTrigger value="история">История</TabsTrigger>
                  <TabsTrigger value="казахский язык">Казахский язык</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="space-y-4">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map(question => (
                  <Card key={question.id} className="hover:bg-accent/30 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link to={`/forum/${question.id}`} className="hover:text-primary transition-colors">
                            <h3 className="font-semibold text-lg mb-2">{question.title}</h3>
                          </Link>
                          <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-3 mb-3">
                            <span>Автор: {question.author}</span>
                            <Badge variant="secondary">{question.course}</Badge>
                            <span>{question.replies} ответов</span>
                            <span>{question.views} просмотров</span>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{question.date}</span>
                      </div>
                      <div className="flex justify-end mt-2">
                        <Link to={`/forum/${question.id}`}>
                          <Button variant="outline" size="sm">
                            Посмотреть обсуждение
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Обсуждения не найдены</h2>
                  <p className="text-muted-foreground mb-6">
                    По вашему запросу не найдено ни одного обсуждения
                  </p>
                  <Button onClick={() => {
                    setSearchTerm('');
                    setActiveTab('all');
                  }}>
                    Сбросить фильтры
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Forum;
