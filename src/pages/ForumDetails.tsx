
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, Heart, Flag, Reply, Calendar, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const ForumDetails = () => {
  const { id } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [replyText, setReplyText] = useState('');
  
  // Mock data for the forum post
  const [post, setPost] = useState({
    id: '1',
    title: 'Как подготовиться к математической части ЕНТ за 1 месяц?',
    content: `Всем привет! Мне осталось всего 30 дней до ЕНТ, а я только начинаю готовиться к математике. Понимаю, что времени очень мало, но я все равно хочу получить максимально возможный балл.

Подскажите, пожалуйста:
1. Какие темы по математике наиболее важны и часто встречаются на ЕНТ?
2. Какие формулы нужно обязательно выучить?
3. Как составить эффективный план подготовки на этот месяц?
4. Какие онлайн-ресурсы и материалы могут помочь быстро подготовиться?

Буду очень благодарен за любую помощь!`,
    author: 'Арман Серікұлы',
    authorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    course: 'Математика для ЕНТ',
    date: '3 дня назад',
    views: 120,
    likes: 15,
    replies: [
      {
        id: 'r1',
        content: `Арман, привет! Я сам готовился к ЕНТ в сжатые сроки, так что поделюсь опытом.

Самые важные темы:
- Уравнения (линейные, квадратные, системы)
- Функции и графики
- Прогрессии (арифметическая и геометрическая)
- Планиметрия (площади фигур, теорема Пифагора)
- Тригонометрия (базовые формулы)

Советую скачать мобильное приложение "ЕНТ Тренажер" - там много тестовых заданий с решениями. Также посмотри видеоуроки на YouTube канале "Мастер ЕНТ".

Главное - решай как можно больше тестовых заданий из прошлых лет. Это даст понимание формата и сложности вопросов.`,
        author: 'Ерлан Болатов',
        authorAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        date: '3 дня назад',
        likes: 8,
      },
      {
        id: 'r2',
        content: `Добавлю к словам Ерлана. Один месяц - это мало, но если заниматься интенсивно, то можно добиться хороших результатов.

Рекомендую разделить подготовку так:
- 1 неделя: повторение базовых понятий и формул
- 2 неделя: решение типовых задач ЕНТ
- 3 неделя: углубленное изучение сложных тем
- 4 неделя: практика на полных тестах ЕНТ

Обязательно используй наш курс "Математика для ЕНТ" - там есть все необходимые материалы и тесты. Успехов!`,
        author: 'Адильжан Мақсат',
        authorAvatar: 'https://randomuser.me/api/portraits/men/52.jpg',
        date: '2 дня назад',
        likes: 12,
      }
    ]
  });
  
  useEffect(() => {
    // In a real app, you would fetch the forum post by ID
    setIsLoaded(true);
  }, [id]);
  
  const handleSubmitReply = () => {
    if (!replyText.trim()) {
      toast.error('Введите текст ответа');
      return;
    }
    
    // Add the new reply
    const newReply = {
      id: `r${post.replies.length + 1}`,
      content: replyText,
      author: 'Вы',
      authorAvatar: 'https://randomuser.me/api/portraits/men/44.jpg',
      date: 'Только что',
      likes: 0,
    };
    
    setPost(prev => ({
      ...prev,
      replies: [...prev.replies, newReply]
    }));
    
    // Clear the reply text
    setReplyText('');
    
    toast.success('Ответ успешно добавлен');
  };
  
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="h-40 bg-gray-200 rounded mb-8"></div>
              
              <div className="space-y-6">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
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
      
      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link to="/forum" className="inline-flex items-center text-primary hover:underline mb-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Вернуться ко всем обсуждениям
            </Link>
            
            <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
              <Badge variant="secondary">{post.course}</Badge>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-1" />
                <span>{post.replies.length} ответов</span>
              </div>
            </div>
          </div>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.authorAvatar} />
                  <AvatarFallback>{post.author.substring(0, 2)}</AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="font-medium">{post.author}</h3>
                  <p className="text-sm text-muted-foreground">Автор темы</p>
                </div>
              </div>
              
              <div className="whitespace-pre-line mb-4">{post.content}</div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Heart className="h-4 w-4 mr-2" />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Reply className="h-4 w-4 mr-2" />
                    Ответить
                  </Button>
                </div>
                
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <Flag className="h-4 w-4 mr-2" />
                  Пожаловаться
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <h2 className="text-xl font-bold mb-4">Ответы ({post.replies.length})</h2>
          
          <div className="space-y-6 mb-8">
            {post.replies.map(reply => (
              <Card key={reply.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={reply.authorAvatar} />
                      <AvatarFallback>{reply.author.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h3 className="font-medium">{reply.author}</h3>
                      <p className="text-sm text-muted-foreground">{reply.date}</p>
                    </div>
                  </div>
                  
                  <div className="whitespace-pre-line mb-4">{reply.content}</div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <Heart className="h-4 w-4 mr-2" />
                        {reply.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <Reply className="h-4 w-4 mr-2" />
                        Ответить
                      </Button>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Flag className="h-4 w-4 mr-2" />
                      Пожаловаться
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Separator className="my-8" />
          
          <div>
            <h2 className="text-xl font-bold mb-4">Добавить ответ</h2>
            
            <Textarea
              placeholder="Напишите ваш ответ здесь..."
              className="min-h-[150px] mb-4"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            
            <Button onClick={handleSubmitReply}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Отправить ответ
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ForumDetails;
