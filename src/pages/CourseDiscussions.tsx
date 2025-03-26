
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageCircle, 
  Plus, 
  Search, 
  Calendar, 
  Users,
  MessagesSquare
} from 'lucide-react';
import { ForumPost } from '@/models/Course';

const CourseDiscussions = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchDiscussions = async () => {
      setLoading(true);
      try {
        // Mock API call
        setTimeout(() => {
          const mockPosts: ForumPost[] = [
            {
              id: 1,
              course_id: Number(courseId),
              user_id: 101,
              user_name: 'Иван Иванов',
              title: 'Вопрос по квадратным уравнениям',
              content: 'У меня возникла сложность с решением квадратных уравнений, когда дискриминант равен нулю. Можете объяснить, как в этом случае находить корни?',
              created_at: '2023-03-10T10:30:00Z',
              comments_count: 3
            },
            {
              id: 2,
              course_id: Number(courseId),
              user_id: 102,
              user_name: 'Мария Петрова',
              title: 'Проблема с тестом',
              content: 'При прохождении теста по линейным уравнениям у меня не засчитался ответ, хотя я уверена, что он был правильным. Это вопрос №5 в тесте.',
              created_at: '2023-03-15T15:45:00Z',
              comments_count: 1
            },
            {
              id: 3,
              course_id: Number(courseId),
              user_id: 103,
              user_name: 'Алексей Смирнов',
              title: 'Вопрос про тригонометрические формулы',
              content: 'Не могу запомнить все тригонометрические формулы. Есть ли какой-то метод или мнемоническое правило для их запоминания?',
              created_at: '2023-03-18T09:15:00Z',
              comments_count: 2
            },
            {
              id: 4,
              course_id: Number(courseId),
              user_id: 104,
              user_name: 'Елена Сидорова',
              title: 'Благодарность преподавателю',
              content: 'Хочу выразить огромную благодарность Болату Асановичу за отличные объяснения и поддержку! Благодаря вашим урокам я стала гораздо лучше понимать математику.',
              created_at: '2023-03-20T13:20:00Z',
              comments_count: 0
            },
            {
              id: 5,
              course_id: Number(courseId),
              user_id: 105,
              user_name: 'Дмитрий Козлов',
              title: 'Дополнительные материалы по теме "Интегралы"',
              content: 'Есть ли у кого-нибудь дополнительные материалы или видеоуроки по теме "Интегралы"? Хотелось бы более глубоко изучить этот раздел.',
              created_at: '2023-03-22T11:10:00Z',
              comments_count: 4
            }
          ];
          
          setPosts(mockPosts);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Failed to fetch discussions:', error);
        setLoading(false);
      }
    };
    
    if (courseId) {
      fetchDiscussions();
    }
  }, [courseId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would filter the discussions on the server
    console.log('Searching for:', searchTerm);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const filteredPosts = searchTerm 
    ? posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.user_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      )
    : posts;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Обсуждения курса</h1>
              <p className="text-muted-foreground mt-1">
                Задавайте вопросы, обсуждайте материалы и общайтесь с преподавателем и другими студентами
              </p>
            </div>
            <Button onClick={() => navigate(`/course/${courseId}/discussions/create`)}>
              <Plus className="h-4 w-4 mr-2" />
              Создать обсуждение
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              <Card className="mb-6">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <CardTitle>Все обсуждения</CardTitle>
                    <form onSubmit={handleSearch} className="relative w-full max-w-sm">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Поиск по обсуждениям..." 
                        className="pl-10"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                    </form>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all">
                    <TabsList className="mb-4">
                      <TabsTrigger value="all">Все</TabsTrigger>
                      <TabsTrigger value="my">Мои обсуждения</TabsTrigger>
                      <TabsTrigger value="unanswered">Без ответов</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all" className="space-y-4">
                      {loading ? (
                        <p className="text-center py-8">Загрузка обсуждений...</p>
                      ) : filteredPosts.length === 0 ? (
                        <p className="text-center py-8">Обсуждения не найдены</p>
                      ) : (
                        filteredPosts.map(post => (
                          <div 
                            key={post.id} 
                            className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                            onClick={() => navigate(`/course/${courseId}/discussions/${post.id}`)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium text-lg">{post.title}</h3>
                              <Badge variant="outline">{post.comments_count} ответов</Badge>
                            </div>
                            
                            <p className="text-muted-foreground line-clamp-2 mb-3">{post.content}</p>
                            
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.user_name}`} />
                                  <AvatarFallback>{post.user_name?.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{post.user_name}</span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>{formatDate(post.created_at || '')}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </TabsContent>
                    
                    <TabsContent value="my">
                      <p className="text-center py-8 text-muted-foreground">У вас пока нет созданных обсуждений</p>
                    </TabsContent>
                    
                    <TabsContent value="unanswered">
                      <div 
                        className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/course/${courseId}/discussions/4`)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-lg">Благодарность преподавателю</h3>
                          <Badge variant="outline">0 ответов</Badge>
                        </div>
                        
                        <p className="text-muted-foreground line-clamp-2 mb-3">
                          Хочу выразить огромную благодарность Болату Асановичу за отличные объяснения и поддержку!
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=Елена Сидорова" />
                              <AvatarFallback>ЕС</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">Елена Сидорова</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>20.03.2023</span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter>
                  <div className="flex justify-center w-full">
                    <Button variant="outline">Загрузить еще</Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Статистика обсуждений</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessagesSquare className="h-4 w-4 text-primary" />
                      <span>Всего обсуждений</span>
                    </div>
                    <span className="font-medium">{posts.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-orange-500" />
                      <span>Всего комментариев</span>
                    </div>
                    <span className="font-medium">
                      {posts.reduce((acc, post) => acc + (post.comments_count || 0), 0)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span>Активных участников</span>
                    </div>
                    <span className="font-medium">5</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Недавние обсуждения</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {posts.slice(0, 3).map(post => (
                    <div 
                      key={post.id}
                      className="p-3 border rounded hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/course/${courseId}/discussions/${post.id}`)}
                    >
                      <h4 className="font-medium line-clamp-1">{post.title}</h4>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-muted-foreground">{post.user_name}</span>
                        <span className="text-xs text-muted-foreground">{formatDate(post.created_at || '')}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    className="w-full"
                    onClick={() => navigate(`/course/${courseId}/discussions`)}
                  >
                    Смотреть все
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CourseDiscussions;
