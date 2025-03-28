
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, X, MessageSquare, SendHorizontal, Calculator, BookOpen, Brain, Sparkles, Link, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [userLanguage, setUserLanguage] = useState('ru'); // Default to Russian
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check user's language preference
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setUserLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const isMathExpression = (text: string) => {
    return /^[\d\s+\-*/().]+$/.test(text.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      if (isMathExpression(input)) {
        try {
          const result = eval(input);
          
          const calculationResponse: Message = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: userLanguage === 'kk' 
              ? `Есептеу нәтижесі: ${result}` 
              : `Результат вычисления: ${result}`,
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, calculationResponse]);
          setIsLoading(false);
          return;
        } catch (error) {
          console.error('Error evaluating expression:', error);
        }
      }
      
      try {
        const response = await axios.post('/api/ai-assistant/ask', { question: input });
        const aiResponse = response.data.data.response;
        
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      } catch (error) {
        console.error('Error calling AI API:', error);
        
        let fallbackResponse = '';
        
        // Provide fallback responses in the appropriate language
        if (userLanguage === 'kk') {
          // Kazakh fallback responses
          if (input.toLowerCase().includes('қазақстан')) {
            fallbackResponse = 'Қазақстан — Орталық Азиядағы мемлекет, бұрынғы кеңестік республика. Астанасы — Астана. Халқы 19 миллионнан астам адамды құрайды. Мемлекеттік тілі — қазақ тілі.';
          } else if (input.toLowerCase().includes('ұбт')) {
            fallbackResponse = 'ҰБТ (Ұлттық бірыңғай тестілеу) — Қазақстан мектептерінің түлектерінің білімін бағалау жүйесі, елдің жоғары оқу орындарына түсу үшін.';
          } else if (input.toLowerCase().includes('математика') || input.toLowerCase().includes('алгебра') || input.toLowerCase().includes('геометри')) {
            fallbackResponse = 'Мектеп математикасы бағдарламасы шеңберінде алгебра, геометрия және математикалық талдау негіздері оқытылады. Негізгі тақырыптарға теңдеулер, функциялар, туындылар, интегралдар, планиметрия және стереометрия кіреді.';
          } else if (input.toLowerCase().includes('физика')) {
            fallbackResponse = 'Мектеп физикасы курсы механика, термодинамика, электр және магнетизм, оптика және кванттық физика элементтерін қамтиды.';
          } else if (input.toLowerCase().includes('сәлем') || input.toLowerCase().includes('амансыз')) {
            fallbackResponse = 'Сәлеметсіз бе! Мен Shabyt ҰБТ-көмекшісімін. Мен сізге емтиханға дайындалуға, мектеп бағдарламасы бойынша сұрақтарға жауап беруге немесе күрделі тақырыптарды түсіндіруге көмектесе аламын.';
          } else {
            fallbackResponse = 'Мен сізге ҰБТ пәндері, дайындық стратегиялары және мектеп бағдарламасының тақырыптары туралы ақпарат бере аламын. Қызықтыратын тақырып бойынша нақты сұрақ қойыңыз.';
          }
        } else {
          // Russian fallback responses
          if (input.toLowerCase().includes('казахстан')) {
            fallbackResponse = 'Казахстан — государство в Центральной Азии, бывшая советская республика. Столица — Астана. Население составляет более 19 миллионов человек. Государственным языком является казахский, а русский имеет статус языка межнационального общения.';
          } else if (input.toLowerCase().includes('ент')) {
            fallbackResponse = 'ЕНТ (Единое национальное тестирование) — система оценки знаний выпускников школ Казахстана для поступления в высшие учебные заведения страны.';
          } else if (input.toLowerCase().includes('математик') || input.toLowerCase().includes('алгебр') || input.toLowerCase().includes('геометри')) {
            fallbackResponse = 'В рамках школьной программы по математике изучаются алгебра, геометрия и начала математического анализа. Ключевые темы включают уравнения, функции, производные, интегралы, планиметрию и стереометрию.';
          } else if (input.toLowerCase().includes('физик')) {
            fallbackResponse = 'Школьный курс физики охватывает механику, термодинамику, электричество и магнетизм, оптику и элементы квантовой физики.';
          } else if (input.toLowerCase().includes('привет') || input.toLowerCase().includes('здравствуй')) {
            fallbackResponse = 'Привет! Я Shabyt ЕНТ-ассистент. Я могу помочь вам с подготовкой к экзамену, ответить на вопросы по школьной программе или объяснить сложные темы.';
          } else {
            fallbackResponse = 'Я могу помочь вам с информацией по предметам ЕНТ, стратегиям подготовки и темам школьной программы. Задайте мне конкретный вопрос по интересующей вас теме.';
          }
        }
        
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: fallbackResponse,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error(userLanguage === 'kk' 
        ? 'Көмекшіден жауап алу мүмкін болмады' 
        : 'Не удалось получить ответ от ассистента');
      
      const errorMessage: Message = {
        id: `assistant-error-${Date.now()}`,
        role: 'assistant',
        content: userLanguage === 'kk'
          ? 'Кешіріңіз, сұранысыңызды өңдеу кезінде қате орын алды. Қайталап көріңіз.'
          : 'Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте еще раз.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const handleFullChat = () => {
    setIsOpen(false);
    navigate('/ai-assistant');
  };

  // Get translated text based on user language
  const getText = (ru: string, kk: string) => {
    return userLanguage === 'kk' ? kk : ru;
  };

  return (
    <>
      <Button
        onClick={toggle}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        size="icon"
        aria-label={getText("Открыть AI ассистента", "AI көмекшісін ашу")}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>
      
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 md:w-96 shadow-lg border-primary/10 h-[600px] flex flex-col overflow-hidden">
          <CardHeader className="px-4 py-3 border-b flex flex-row justify-between items-center shrink-0">
            <CardTitle className="text-lg flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              <span>{getText("Shabyt ЕНТ Ассистент", "Shabyt ҰБТ Көмекшісі")}</span>
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={handleFullChat}
              title={getText("Открыть полный чат", "Толық чатты ашу")}
            >
              <Sparkles className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="mx-4 mt-2 mb-2 grid grid-cols-2 shrink-0">
              <TabsTrigger value="chat">
                <MessageSquare className="h-4 w-4 mr-2" />
                {getText("Чат", "Чат")}
              </TabsTrigger>
              <TabsTrigger value="examples">
                <Sparkles className="h-4 w-4 mr-2" />
                {getText("Примеры", "Мысалдар")}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
              <ScrollArea 
                ref={scrollAreaRef} 
                className="flex-1"
                style={{ height: "calc(100% - 64px)" }}
              >
                <div className="space-y-4 p-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Brain className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">
                        {getText("Привет! Я Shabyt ЕНТ-ассистент.", "Сәлем! Мен Shabyt ҰБТ-көмекшісімін.")}
                      </p>
                      <p className="text-sm mt-1">
                        {getText(
                          "Задайте мне вопрос по любому предмету ЕНТ или напишите математическое выражение для вычисления.",
                          "Маған кез келген ҰБТ пәні бойынша сұрақ қойыңыз немесе есептеу үшін математикалық өрнекті жазыңыз."
                        )}
                      </p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[85%] px-3 py-2 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div
                        className="max-w-[85%] px-3 py-2 rounded-lg bg-muted text-foreground"
                      >
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">{getText("Печатает...", "Жазып жатыр...")}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <CardFooter className="border-t p-2 shrink-0 mt-auto">
                <form onSubmit={handleSubmit} className="flex gap-2 w-full">
                  <Input
                    ref={inputRef}
                    placeholder={getText("Задайте вопрос...", "Сұрақ қойыңыз...")}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    className={isMathExpression(input) ? "font-mono" : ""}
                  />
                  <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
                  </Button>
                </form>
              </CardFooter>
            </TabsContent>
            
            <TabsContent value="examples" className="p-0 m-0">
              <ScrollArea className="h-[500px] p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">{getText("Примеры запросов", "Сұраныс мысалдары")}</h3>
                    
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-left h-auto py-2 px-3"
                        onClick={() => {
                          setInput(getText('Объясни теорему Пифагора простыми словами', 'Пифагор теоремасын қарапайым сөздермен түсіндір'));
                          setActiveTab('chat');
                          if (inputRef.current) inputRef.current.focus();
                        }}
                      >
                        <div className="flex items-start">
                          <BookOpen className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                          <div>
                            <p className="font-medium">{getText('Объясни теорему Пифагора простыми словами', 'Пифагор теоремасын қарапайым сөздермен түсіндір')}</p>
                          </div>
                        </div>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-left h-auto py-2 px-3"
                        onClick={() => {
                          setInput(getText('Какие формулы нужно знать для решения тригонометрических уравнений?', 'Тригонометриялық теңдеулерді шешу үшін қандай формулаларды білу керек?'));
                          setActiveTab('chat');
                          if (inputRef.current) inputRef.current.focus();
                        }}
                      >
                        <div className="flex items-start">
                          <BookOpen className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                          <div>
                            <p className="font-medium">{getText('Какие формулы нужно знать для решения тригонометрических уравнений?', 'Тригонометриялық теңдеулерді шешу үшін қандай формулаларды білу керек?')}</p>
                          </div>
                        </div>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-left h-auto py-2 px-3"
                        onClick={() => {
                          setInput('25 * 18 / 2 + 37');
                          setActiveTab('chat');
                          if (inputRef.current) inputRef.current.focus();
                        }}
                      >
                        <div className="flex items-start">
                          <Calculator className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                          <div>
                            <p className="font-medium font-mono">25 * 18 / 2 + 37</p>
                          </div>
                        </div>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-left h-auto py-2 px-3"
                        onClick={() => {
                          setInput(getText('Расскажи о важных событиях в истории Казахстана', 'Қазақстан тарихындағы маңызды оқиғалар туралы айтып бер'));
                          setActiveTab('chat');
                          if (inputRef.current) inputRef.current.focus();
                        }}
                      >
                        <div className="flex items-start">
                          <BookOpen className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                          <div>
                            <p className="font-medium">{getText('Расскажи о важных событиях в истории Казахстана', 'Қазақстан тарихындағы маңызды оқиғалар туралы айтып бер')}</p>
                          </div>
                        </div>
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">{getText("Возможности", "Мүмкіндіктер")}</h3>
                    
                    <div className="space-y-3">
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-start">
                          <BookOpen className="h-5 w-5 mr-2 text-primary flex-shrink-0" />
                          <div>
                            <p className="font-medium">{getText("Объяснение тем", "Тақырыптарды түсіндіру")}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {getText(
                                "Получите простые и понятные объяснения любой темы школьной программы",
                                "Мектеп бағдарламасының кез келген тақырыбы бойынша қарапайым және түсінікті түсіндірмелер алыңыз"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-start">
                          <Calculator className="h-5 w-5 mr-2 text-primary flex-shrink-0" />
                          <div>
                            <p className="font-medium">{getText("Вычисления", "Есептеулер")}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {getText(
                                "Мгновенное вычисление математических выражений",
                                "Математикалық өрнектерді лезде есептеу"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={handleFullChat}
                    >
                      <Link className="h-4 w-4 mr-2" />
                      {getText("Открыть полный чат", "Толық чатты ашу")}
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </>
  );
};

export default AIAssistant;
