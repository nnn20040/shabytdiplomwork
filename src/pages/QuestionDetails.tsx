
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
import { MessageCircle, CheckCircle, Calendar, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const QuestionDetails = () => {
  const { id } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [responseText, setResponseText] = useState('');
  
  // Mock data for the question
  const [question, setQuestion] = useState({
    id: '1',
    title: 'Не могу понять решение квадратных уравнений',
    content: `Здравствуйте! Я недавно начал изучать тему "Квадратные уравнения" и столкнулся с проблемами в понимании дискриминанта и его применения.

Можете ли вы объяснить, как правильно находить корни квадратного уравнения, если дискриминант больше нуля, равен нулю или меньше нуля? Особенно сложно мне даются примеры, где коэффициенты заданы в виде дробей или отрицательных чисел.

Буду очень благодарен за ваш ответ!`,
    student: 'Арман Серікұлы',
    studentAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    course: 'Математика для ЕНТ',
    courseId: '1',
    date: '2 дня назад',
    status: 'открыт',
    responses: [
      {
        id: 'r1',
        content: `Доброе утро, Арман!

Я рад, что вы задали этот вопрос. Квадратные уравнения - очень важная тема, которая будет часто встречаться на ЕНТ.

Давайте разберем поэтапно:

1. Квадратное уравнение имеет вид: ax² + bx + c = 0, где a, b и c - коэффициенты.

2. Дискриминант (D) вычисляется по формуле: D = b² - 4ac

3. В зависимости от значения дискриминанта:
   - Если D > 0: уравнение имеет два различных корня: x₁ = (-b + √D) / (2a) и x₂ = (-b - √D) / (2a)
   - Если D = 0: уравнение имеет один корень (корни совпадают): x = -b / (2a)
   - Если D < 0: уравнение не имеет действительных корней (только комплексные)

Давайте рассмотрим пример: 2x² - 5x + 2 = 0
Здесь a = 2, b = -5, c = 2

Дискриминант: D = (-5)² - 4 × 2 × 2 = 25 - 16 = 9
D > 0, значит два корня:
x₁ = (5 + √9) / (2 × 2) = (5 + 3) / 4 = 2
x₂ = (5 - √9) / (2 × 2) = (5 - 3) / 4 = 0.5

Для случаев с дробями принцип тот же, просто будьте внимательны при вычислениях.

Я приложил к этому сообщению презентацию с дополнительными примерами. Если останутся вопросы, обязательно напишите!`,
        teacher: 'Адильжан Мақсат',
        teacherAvatar: 'https://randomuser.me/api/portraits/men/52.jpg',
        date: '1 день назад',
        attachment: 'quadratic-equations.pdf',
      }
    ],
  });
  
  useEffect(() => {
    // In a real app, you would fetch the question by ID
    setIsLoaded(true);
  }, [id]);
  
  const handleSubmitResponse = () => {
    if (!responseText.trim()) {
      toast.error('Введите текст ответа');
      return;
    }
    
    // Add the new response
    const newResponse = {
      id: `r${question.responses.length + 1}`,
      content: responseText,
      teacher: 'Вы',
      teacherAvatar: 'https://randomuser.me/api/portraits/men/44.jpg',
      date: 'Только что',
    };
    
    setQuestion(prev => ({
      ...prev,
      responses: [...prev.responses, newResponse],
      status: 'отвечен'
    }));
    
    // Clear the response text
    setResponseText('');
    
    toast.success('Ответ успешно добавлен');
  };
  
  const handleCloseQuestion = () => {
    setQuestion(prev => ({
      ...prev,
      status: 'закрыт'
    }));
    
    toast.success('Вопрос закрыт');
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
            <Link to="/student-dashboard" className="inline-flex items-center text-primary hover:underline mb-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Вернуться к вопросам
            </Link>
            
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold mb-2">{question.title}</h1>
                
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                  <Badge 
                    variant={question.status === 'открыт' ? 'outline' : question.status === 'отвечен' ? 'secondary' : 'default'}
                    className={question.status === 'закрыт' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {question.status === 'закрыт' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {question.status === 'открыт' ? 'Открыт' : question.status === 'отвечен' ? 'Отвечен' : 'Закрыт'}
                  </Badge>
                  <Badge variant="secondary">{question.course}</Badge>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{question.date}</span>
                  </div>
                </div>
              </div>
              
              {question.status !== 'закрыт' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleCloseQuestion}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Закрыть вопрос
                </Button>
              )}
            </div>
          </div>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={question.studentAvatar} />
                  <AvatarFallback>{question.student.substring(0, 2)}</AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="font-medium">{question.student}</h3>
                  <p className="text-sm text-muted-foreground">Студент</p>
                </div>
              </div>
              
              <div className="whitespace-pre-line mb-4">{question.content}</div>
            </CardContent>
          </Card>
          
          <h2 className="text-xl font-bold mb-4">Ответы ({question.responses.length})</h2>
          
          <div className="space-y-6 mb-8">
            {question.responses.map(response => (
              <Card key={response.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={response.teacherAvatar} />
                      <AvatarFallback>{response.teacher.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h3 className="font-medium">{response.teacher}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Badge variant="outline" className="mr-2">Преподаватель</Badge>
                        <span>{response.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="whitespace-pre-line mb-4">{response.content}</div>
                  
                  {response.attachment && (
                    <div className="bg-secondary/50 rounded-lg p-3 inline-block">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                        </svg>
                        <span className="font-medium">{response.attachment}</span>
                      </div>
                      <Button variant="link" className="mt-1 h-auto p-0 text-xs">Скачать</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {question.status !== 'закрыт' && (
            <>
              <Separator className="my-8" />
              
              <div>
                <h2 className="text-xl font-bold mb-4">Ответить на вопрос</h2>
                
                <Textarea
                  placeholder="Напишите ваш ответ здесь..."
                  className="min-h-[150px] mb-4"
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Button variant="outline" className="mr-2">
                      Прикрепить файл
                    </Button>
                  </div>
                  
                  <Button onClick={handleSubmitResponse}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Отправить ответ
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default QuestionDetails;
