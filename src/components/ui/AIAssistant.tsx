
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    // Focus input when assistant is opened
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Helper to check if input is a math expression
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
      // Check if it's a math expression
      if (isMathExpression(input)) {
        try {
          // Simple eval for math expressions - only for demo purposes
          // In production, this should be done securely on the server
          // eslint-disable-next-line no-eval
          const result = eval(input);
          
          const calculationResponse: Message = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: `Результат вычисления: ${result}`,
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, calculationResponse]);
          setIsLoading(false);
          return;
        } catch (error) {
          console.error('Error evaluating expression:', error);
          // Continue to API call if evaluation fails
        }
      }
      
      // Call to backend AI service
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
        
        // Use fallback responses if API call fails
        let fallbackResponse = '';
        
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
      toast.error('Не удалось получить ответ от ассистента');
      
      const errorMessage: Message = {
        id: `assistant-error-${Date.now()}`,
        role: 'assistant',
        content: 'Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте еще раз.',
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

  return (
    <>
      {/* Floating button */}
      <Button
        onClick={toggle}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        size="icon"
        aria-label="Открыть AI ассистента"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>
      
      {/* Assistant panel */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 md:w-96 shadow-lg border-primary/10 max-h-[70vh] flex flex-col overflow-hidden">
          <CardHeader className="px-4 py-3 border-b flex flex-row justify-between items-center shrink-0">
            <CardTitle className="text-lg flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              <span>Shabyt ЕНТ Ассистент</span>
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={handleFullChat}
              title="Открыть полный чат"
            >
              <Sparkles className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="mx-4 mt-2 mb-2 grid grid-cols-2 shrink-0">
              <TabsTrigger value="chat">
                <MessageSquare className="h-4 w-4 mr-2" />
                Чат
              </TabsTrigger>
              <TabsTrigger value="examples">
                <Sparkles className="h-4 w-4 mr-2" />
                Примеры
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0 overflow-hidden">
              <ScrollArea 
                ref={scrollAreaRef} 
                className="flex-1 px-4 overflow-y-auto"
                style={{ height: "calc(100% - 80px)" }}
              >
                <div className="space-y-4 py-2">
                  {messages.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Brain className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Привет! Я Shabyt ЕНТ-ассистент.</p>
                      <p className="text-sm mt-1">Задайте мне вопрос по любому предмету ЕНТ или напишите математическое выражение для вычисления.</p>
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
                          <span className="text-sm">Печатает...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <CardFooter className="border-t p-2 shrink-0">
                <form onSubmit={handleSubmit} className="flex gap-2 w-full">
                  <Input
                    ref={inputRef}
                    placeholder="Задайте вопрос..."
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
            
            <TabsContent value="examples" className="p-0 m-0 overflow-hidden">
              <ScrollArea className="h-[300px] p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Примеры запросов</h3>
                    
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-left h-auto py-2 px-3"
                        onClick={() => {
                          setInput('Объясни теорему Пифагора простыми словами');
                          setActiveTab('chat');
                          if (inputRef.current) inputRef.current.focus();
                        }}
                      >
                        <div className="flex items-start">
                          <BookOpen className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                          <div>
                            <p className="font-medium">Объясни теорему Пифагора простыми словами</p>
                          </div>
                        </div>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-left h-auto py-2 px-3"
                        onClick={() => {
                          setInput('Какие формулы нужно знать для решения тригонометрических уравнений?');
                          setActiveTab('chat');
                          if (inputRef.current) inputRef.current.focus();
                        }}
                      >
                        <div className="flex items-start">
                          <BookOpen className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                          <div>
                            <p className="font-medium">Какие формулы нужно знать для решения тригонометрических уравнений?</p>
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
                          setInput('Расскажи о важных событиях в истории Казахстана');
                          setActiveTab('chat');
                          if (inputRef.current) inputRef.current.focus();
                        }}
                      >
                        <div className="flex items-start">
                          <BookOpen className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                          <div>
                            <p className="font-medium">Расскажи о важных событиях в истории Казахстана</p>
                          </div>
                        </div>
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Возможности</h3>
                    
                    <div className="space-y-3">
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-start">
                          <BookOpen className="h-5 w-5 mr-2 text-primary flex-shrink-0" />
                          <div>
                            <p className="font-medium">Объяснение тем</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Получите простые и понятные объяснения любой темы школьной программы
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-start">
                          <Calculator className="h-5 w-5 mr-2 text-primary flex-shrink-0" />
                          <div>
                            <p className="font-medium">Вычисления</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Мгновенное вычисление математических выражений
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
                      Открыть полный чат
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
