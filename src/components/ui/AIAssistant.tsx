
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  X, 
  ChevronDown, 
  Send, 
  Calculator, 
  Brain, 
  History, 
  Loader2, 
  Search 
} from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Здравствуйте! Я ИИ-ассистент для подготовки к ЕНТ. Я могу помочь вам с вопросами по математике, физике, истории и другим предметам. Не стесняйтесь задавать вопросы!',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // History of common questions
  const commonQuestions = [
    "Что такое ЕНТ?",
    "Как решать квадратные уравнения?",
    "Законы Ньютона",
    "Основные даты в истории Казахстана",
    "Как вычислить производную?",
    "Что такое логарифм?"
  ];

  // Function to check if input is a math expression
  const isMathExpression = (text: string) => {
    return /^[\d\s+\-*/().]+$/.test(text.trim());
  };

  // Function to evaluate math expressions
  const evaluateMathExpression = (expression: string) => {
    try {
      // Basic sanitization - remove all characters except numbers, basic operators and parentheses
      const sanitized = expression.replace(/[^0-9+\-*/(). ]/g, '');
      
      // Use Function constructor to evaluate the expression safely
      // Note: In a production environment, you'd want to use a proper math library
      return new Function(`return ${sanitized}`)();
    } catch (error) {
      console.error('Math evaluation error:', error);
      return 'Не удалось вычислить выражение. Пожалуйста, проверьте синтаксис.';
    }
  };

  // Function to get AI response for text questions
  const getAIResponse = async (question: string) => {
    // In a real app, this would call an external AI API
    // This is a simplified version that returns predefined responses
    
    const lowercaseQuestion = question.toLowerCase();
    
    // Try to find a matching response based on keywords
    if (lowercaseQuestion.includes('ент')) {
      return 'ЕНТ (Единое Национальное Тестирование) - это стандартизированный экзамен для выпускников школ в Казахстане. Он используется для поступления в высшие учебные заведения. Основные предметы включают математику, историю Казахстана, грамматику казахского/русского языка и предметы по выбору в зависимости от выбранной специальности.';
    } else if (lowercaseQuestion.includes('математик')) {
      return 'В математической части ЕНТ тестируются знания по алгебре, геометрии и математическому анализу. Ключевые темы включают функции, уравнения, неравенства, векторы, производные и интегралы. Рекомендую начать с базовых концепций и постепенно переходить к более сложным задачам.';
    } else if (lowercaseQuestion.includes('физик')) {
      return 'Физика на ЕНТ охватывает механику, термодинамику, электричество и магнетизм, оптику и элементы квантовой физики. Особое внимание уделяется умению решать задачи и применять физические законы. Регулярная практика решения задач - ключ к успеху в этом разделе.';
    } else if (lowercaseQuestion.includes('привет') || lowercaseQuestion.includes('здравствуй')) {
      return 'Здравствуйте! Я ИИ-ассистент для подготовки к ЕНТ. Чем я могу помочь вам сегодня?';
    } else if (lowercaseQuestion.includes('как дела') || lowercaseQuestion.includes('как у тебя дела')) {
      return 'У меня всё хорошо, спасибо! Я готов помочь вам с вопросами по подготовке к ЕНТ. Какой предмет вас интересует?';
    } else if (lowercaseQuestion.includes('помощь') || lowercaseQuestion.includes('помоги')) {
      return 'Я могу помочь вам с подготовкой к ЕНТ по разным предметам, объяснить сложные концепции и предложить стратегии обучения. Просто задайте мне конкретный вопрос.';
    } else if (lowercaseQuestion.includes('квадратн') && lowercaseQuestion.includes('уравнен')) {
      return 'Квадратное уравнение имеет вид ax² + bx + c = 0, где a ≠ 0. Для его решения:\n\n1. Вычислите дискриминант D = b² - 4ac\n2. Если D > 0, уравнение имеет два корня: x₁ = (-b + √D)/(2a) и x₂ = (-b - √D)/(2a)\n3. Если D = 0, уравнение имеет один корень: x = -b/(2a)\n4. Если D < 0, уравнение не имеет действительных корней\n\nНапример, для уравнения x² - 5x + 6 = 0:\nD = (-5)² - 4×1×6 = 25 - 24 = 1\nx₁ = (5 + 1)/2 = 3\nx₂ = (5 - 1)/2 = 2\nОтвет: x = 2 или x = 3';
    } else if (lowercaseQuestion.includes('логарифм')) {
      return 'Логарифм числа b по основанию a (обозначается как log_a(b)) — это число c, такое что a^c = b.\n\nОсновные свойства логарифмов:\n1. log_a(xy) = log_a(x) + log_a(y)\n2. log_a(x/y) = log_a(x) - log_a(y)\n3. log_a(x^n) = n · log_a(x)\n4. log_a(a) = 1\n5. log_a(1) = 0\n\nНаиболее часто используются натуральный логарифм (ln, основание e ≈ 2.718) и десятичный логарифм (lg, основание 10).';
    } else if (lowercaseQuestion.includes('ньютон') && (lowercaseQuestion.includes('закон') || lowercaseQuestion.includes('законы'))) {
      return 'Законы Ньютона — три основных закона классической механики:\n\n1. Первый закон (закон инерции): Тело находится в состоянии покоя или равномерного прямолинейного движения, если на него не действуют внешние силы или их действие скомпенсировано.\n\n2. Второй закон (основной закон динамики): Ускорение тела прямо пропорционально приложенной к нему силе и обратно пропорционально его массе: F = ma.\n\n3. Третий закон (закон действия и противодействия): Силы, с которыми два тела действуют друг на друга, равны по модулю и противоположны по направлению.';
    } else if (lowercaseQuestion.includes('производн')) {
      return 'Производная функции f(x) в точке x — это предел отношения приращения функции к приращению аргумента, когда приращение аргумента стремится к нулю.\n\nОсновные правила дифференцирования:\n1. (C)′ = 0 (производная константы равна нулю)\n2. (x^n)′ = n·x^(n-1) (производная степенной функции)\n3. (sin x)′ = cos x\n4. (cos x)′ = -sin x\n5. (e^x)′ = e^x\n6. (ln x)′ = 1/x\n\nПравила дифференцирования сложных выражений:\n1. (f + g)′ = f′ + g′\n2. (f · g)′ = f′g + fg′\n3. (f/g)′ = (f′g - fg′)/g²\n4. (f(g(x)))′ = f′(g(x)) · g′(x) (правило цепи)';
    } else if (lowercaseQuestion.includes('истори') && lowercaseQuestion.includes('казахстан')) {
      return 'Ключевые даты в истории Казахстана:\n\n- VI-III века до н.э. - Государство саков\n- VI-VIII века - Тюркский каганат\n- IX-XII века - Государство Караханидов\n- XIII-XV века - Монгольское нашествие и Золотая Орда\n- 1465-1466 - Образование Казахского ханства (Керей и Жанибек)\n- 1731-1740 - Присоединение казахских жузов к Российской империи\n- 1916 - Национально-освободительное восстание\n- 1920-1936 - Казахская АССР в составе РСФСР\n- 1936-1991 - Казахская ССР в составе СССР\n- 16 декабря 1991 - Провозглашение независимости Казахстана\n- 1995 - Принятие новой Конституции\n- 1997 - Перенос столицы из Алматы в Астану (ныне Нур-Султан)';
    } else {
      // For questions we don't have a specific answer to, use a more generic response
      // In a real app, this would be a call to an AI API
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const genericResponses = [
        `Спасибо за ваш вопрос о "${question}". Это интересная тема! Я рекомендую изучить материалы по этому вопросу в учебниках для подготовки к ЕНТ или проконсультироваться с преподавателем для получения более подробной информации.`,
        `Для глубокого понимания темы "${question}" я рекомендую разбить ее на подтемы и изучать постепенно. Начните с базовых понятий, затем переходите к более сложным аспектам. Регулярные практические задания помогут закрепить материал.`,
        `Тема "${question}" часто встречается на ЕНТ. При подготовке обратите внимание на ключевые концепции и формулы. Важно не только запомнить их, но и понять принципы применения в различных задачах.`,
        `Чтобы лучше разобраться в вопросе "${question}", попробуйте использовать различные источники информации: учебники, видеоуроки, онлайн-курсы. Разные подходы к объяснению помогут сформировать более полное понимание темы.`
      ];
      
      // Return a random generic response
      return genericResponses[Math.floor(Math.random() * genericResponses.length)];
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    try {
      let response: string;
      
      // Check if it's a math expression
      if (isMathExpression(message)) {
        response = evaluateMathExpression(message).toString();
      } else {
        // Get AI response for text questions
        response = await getAIResponse(message);
      }
      
      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error('Не удалось получить ответ от ассистента');
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectQuestion = (question: string) => {
    setMessage(question);
    setHistoryOpen(false);
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Chat button */}
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
      
      {/* Chat interface */}
      <div className={`fixed bottom-0 right-0 w-full sm:w-96 h-[600px] max-h-[80vh] bg-background border border-border rounded-t-lg shadow-xl transform transition-transform duration-300 z-50 flex flex-col ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}>
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src="/ai-assistant.png" />
              <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-sm">ИИ-Ассистент</h3>
              <p className="text-xs text-muted-foreground">Помощник в подготовке к ЕНТ</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setHistoryOpen(!historyOpen)}
            >
              <History className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => {
                setIsOpen(false);
                setMessages([{
                  id: '1',
                  content: 'Здравствуйте! Я ИИ-ассистент для подготовки к ЕНТ. Я могу помочь вам с вопросами по математике, физике, истории и другим предметам. Не стесняйтесь задавать вопросы!',
                  role: 'assistant',
                  timestamp: new Date()
                }]);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Message history */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}
                >
                  <div className="whitespace-pre-line text-sm">
                    {msg.content}
                  </div>
                  <div className={`text-xs mt-1 ${
                    msg.role === 'user' 
                      ? 'text-primary-foreground/70' 
                      : 'text-muted-foreground'
                  }`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Ассистент печатает...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {/* Common questions/history sidebar */}
        <div className={`absolute right-0 top-16 bottom-[60px] w-full border-l bg-background transform transition-transform duration-200 ${
          historyOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Поиск вопросов..." 
                className="pl-8"
              />
            </div>
          </div>
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              <div className="mb-2">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Математика
                </h4>
                <div className="mt-2 space-y-1">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-sm h-auto py-2 px-3"
                    onClick={() => handleSelectQuestion("Как решать квадратные уравнения?")}
                  >
                    Как решать квадратные уравнения?
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-sm h-auto py-2 px-3"
                    onClick={() => handleSelectQuestion("Что такое логарифм?")}
                  >
                    Что такое логарифм?
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-sm h-auto py-2 px-3"
                    onClick={() => handleSelectQuestion("Как вычислить производную?")}
                  >
                    Как вычислить производную?
                  </Button>
                </div>
              </div>
              
              <div className="mb-2">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Общие вопросы
                </h4>
                <div className="mt-2 space-y-1">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-sm h-auto py-2 px-3"
                    onClick={() => handleSelectQuestion("Что такое ЕНТ?")}
                  >
                    Что такое ЕНТ?
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-sm h-auto py-2 px-3"
                    onClick={() => handleSelectQuestion("Законы Ньютона")}
                  >
                    Законы Ньютона
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-sm h-auto py-2 px-3"
                    onClick={() => handleSelectQuestion("Основные даты в истории Казахстана")}
                  >
                    Основные даты в истории Казахстана
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
        
        {/* Input area */}
        <div className="p-4 border-t">
          <div className="flex items-start gap-2">
            <Textarea
              ref={inputRef}
              placeholder="Задайте вопрос..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="resize-none"
              rows={1}
            />
            <Button 
              size="icon" 
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-7 px-2"
              onClick={() => setMessage("Что такое ЕНТ?")}
            >
              Что такое ЕНТ?
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-7 px-2"
              onClick={() => setMessage("5 * (7 + 3) / 2")}
            >
              Пример: 5 * (7 + 3) / 2
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIAssistant;
