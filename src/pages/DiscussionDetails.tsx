
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  MessageCircle, 
  ThumbsUp, 
  Clock, 
  Share, 
  Flag 
} from 'lucide-react';
import { toast } from 'sonner';
import { ForumPost, ForumComment } from '@/models/Course';

const DiscussionDetails = () => {
  const { courseId, discussionId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchDiscussion = async () => {
      setLoading(true);
      try {
        // Mock API call
        setTimeout(() => {
          // Simulate fetching post details
          const mockPost: ForumPost = {
            id: Number(discussionId),
            course_id: Number(courseId),
            user_id: 101,
            user_name: 'Иван Иванов',
            title: 'Вопрос по квадратным уравнениям',
            content: 'У меня возникла сложность с решением квадратных уравнений, когда дискриминант равен нулю. В учебнике написано, что в этом случае уравнение имеет два одинаковых корня, но я не понимаю, как это соотносится с формулой корней квадратного уравнения.\n\nНапример, уравнение x² - 6x + 9 = 0 имеет дискриминант D = 0. Правильно ли я понимаю, что корень будет x = 3? И почему говорят о "двух одинаковых корнях", а не об одном корне?\n\nБуду благодарен за разъяснение!',
            created_at: '2023-03-10T10:30:00Z',
            comments_count: 3
          };
          
          // Simulate fetching comments
          const mockComments: ForumComment[] = [
            {
              id: 1,
              post_id: Number(discussionId),
              user_id: 201,
              user_name: 'Болат Асанов',
              content: 'Добрый день, Иван! Вы правильно нашли корень уравнения x² - 6x + 9 = 0, это действительно x = 3.\n\nКогда мы говорим о "двух одинаковых корнях", мы имеем в виду, что это корень кратности 2. В общем случае, квадратное уравнение имеет два корня (с учетом кратности). Когда дискриминант равен нулю, эти два корня совпадают.\n\nС точки зрения формулы корней x = (-b ± √D) / (2a), при D = 0 слагаемое √D обращается в ноль, и оба корня действительно получаются одинаковыми: x = -b/(2a).\n\nМатематики говорят о "двух корнях" в том числе из соображений непрерывности теории: если немного изменить коэффициенты уравнения, дискриминант станет положительным, и появятся два разных корня. При D = 0 эти два корня как бы "сливаются" в один.',
              created_at: '2023-03-10T11:45:00Z'
            },
            {
              id: 2,
              post_id: Number(discussionId),
              user_id: 101,
              user_name: 'Иван Иванов',
              content: 'Спасибо большое за объяснение! Теперь понял, что речь идет о корне кратности 2. И действительно, если представить, что коэффициенты немного меняются, то логично, что корни разойдутся на два разных значения.',
              created_at: '2023-03-10T12:20:00Z'
            },
            {
              id: 3,
              post_id: Number(discussionId),
              user_id: 102,
              user_name: 'Мария Петрова',
              content: 'У меня был такой же вопрос! Спасибо преподавателю за понятное объяснение и Ивану за вопрос.',
              created_at: '2023-03-10T15:05:00Z'
            }
          ];
          
          setPost(mockPost);
          setComments(mockComments);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Failed to fetch discussion:', error);
        setLoading(false);
      }
    };
    
    if (courseId && discussionId) {
      fetchDiscussion();
    }
  }, [courseId, discussionId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim()) {
      toast.error('Пожалуйста, введите текст комментария');
      return;
    }
    
    setSubmitting(true);
    try {
      // Mock API call
      setTimeout(() => {
        const newComment: ForumComment = {
          id: comments.length + 1,
          post_id: Number(discussionId),
          user_id: 103, // Current user ID (mock)
          user_name: 'Текущий пользователь', // Current user name (mock)
          content: replyText,
          created_at: new Date().toISOString()
        };
        
        setComments([...comments, newComment]);
        setReplyText('');
        toast.success('Комментарий добавлен');
        setSubmitting(false);
      }, 800);
    } catch (error) {
      console.error('Failed to submit reply:', error);
      toast.error('Не удалось добавить комментарий');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container">
            <p className="text-center">Загрузка обсуждения...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container">
            <p className="text-center">Обсуждение не найдено</p>
            <div className="flex justify-center mt-4">
              <Button onClick={() => navigate(`/course/${courseId}/discussions`)}>
                Вернуться к обсуждениям
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
        <div className="container max-w-4xl">
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => navigate(`/course/${courseId}/discussions`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к обсуждениям
          </Button>
          
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl">{post.title}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Share className="h-4 w-4 mr-1" />
                    Поделиться
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Flag className="h-4 w-4 mr-1" />
                    Пожаловаться
                  </Button>
                </div>
              </div>
              <div className="flex items-center mt-2">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.user_name}`} />
                  <AvatarFallback>{post.user_name?.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{post.user_name}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{formatDate(post.created_at || '')}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {post.content.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              
              <div className="flex items-center mt-6 space-x-4">
                <Button variant="outline" size="sm">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Полезно (5)
                </Button>
                <Button variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Комментарии ({comments.length})
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Комментарии ({comments.length})</h2>
            
            {comments.map((comment) => (
              <div key={comment.id} className="mb-6">
                <div className="flex items-start">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.user_name}`} />
                    <AvatarFallback>{comment.user_name?.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-secondary p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium">{comment.user_name}</p>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.created_at || '')}
                        </span>
                      </div>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {comment.content.split('\n\n').map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center mt-2 space-x-4 ml-2">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        Полезно
                      </Button>
                      <Button variant="ghost" size="sm">
                        Ответить
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <Separator className="my-8" />
            
            <h3 className="text-lg font-medium mb-4">Добавить комментарий</h3>
            <div className="flex items-start mb-4">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=Текущий пользователь" />
                <AvatarFallback>ТП</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea 
                  placeholder="Напишите свой комментарий..." 
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                  <Button 
                    onClick={handleSubmitReply} 
                    disabled={submitting || !replyText.trim()}
                  >
                    {submitting ? 'Отправка...' : 'Отправить'}
                  </Button>
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

export default DiscussionDetails;
