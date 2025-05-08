
import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, Send, ChevronRight, ArrowUp, Loader2, MessageSquare, X as CloseIcon, Sparkles, Book, Calculator, Image, Crown, Search } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { Textarea } from '@/components/ui/textarea';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}

const AIChatPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const initialConversation: Conversation = {
      id: 'default',
      title: 'Новый чат',
      lastMessage: 'Привет! Я ваш ЕНТ-ассистент. Чем я могу вам помочь?',
      timestamp: new Date(),
      messages: [
        {
          id: 'welcome',
          role: 'assistant',
          content: 'Привет! Я ваш ЕНТ-ассистент. Я могу помочь вам с подготовкой к экзамену, ответить на вопросы по школьной программе и объяснить сложные темы. Что вас интересует?',
          timestamp: new Date(),
        },
      ],
    };
    
    setConversations([initialConversation]);
    setActiveConversation(initialConversation.id);
  }, []);
  
  useEffect(() => {
    // Ensure messages scroll to bottom when they change
    if (messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [activeConversation, conversations]);
  
  const getCurrentConversation = (): Conversation | undefined => {
    return conversations.find(conv => conv.id === activeConversation);
  };
  
  const getCurrentMessages = (): Message[] => {
    const conversation = getCurrentConversation();
    return conversation ? conversation.messages : [];
  };
  
  const isMathExpression = (text: string) => {
    return /^[\d\s+\-*/().]+$/.test(text.trim());
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    if (!activeConversation) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setConversations(prevConversations => {
      return prevConversations.map(conv => {
        if (conv.id === activeConversation) {
          return {
            ...conv,
            lastMessage: input,
            timestamp: new Date(),
            messages: [...conv.messages, userMessage],
          };
        }
        return conv;
      });
    });
    
    setInput('');
    setIsLoading(true);
    
    try {
      if (isMathExpression(input)) {
        try {
          // eslint-disable-next-line no-eval
          const result = eval(input);
          const response = `Результат вычисления: ${result}`;
          
          addAssistantResponse(response);
          return;
        } catch (error) {
          console.error('Error evaluating expression:', error);
        }
      }
      
      try {
        const response = await axios.post('/api/ai-assistant/ask', { question: input });
        const aiResponse = response.data.data.response;
        
        addAssistantResponse(aiResponse);
      } catch (error) {
        console.error('Error calling AI API:', error);
        
        let fallbackResponse = '';
        
        if (input.toLowerCase().includes('казахстан')) {
          fallbackResponse = 'Казахстан — государство в Центральной Азии, бывшая советская республика. Столица — Астана. Население составляет более 19 миллионов человек. Государственным языком является казахский, а русский имеет статус языка межнационального общения. Казахстан богат природными ресурсами, включая нефть, газ и минералы.';
        } else if (input.toLowerCase().includes('ент')) {
          fallbackResponse = 'ЕНТ (Единое национальное тестирование) — система оценки знаний выпускников школ Казахстана для поступления в высшие учебные заведения страны. Тестирование включает обязательные предметы (математическая грамотность, грамотность чтения, история Казахстана) и профильные предметы в зависимости от выбранной специальности.';
        } else if (input.toLowerCase().includes('математик') || input.toLowerCase().includes('алгебр') || input.toLowerCase().includes('геометри')) {
          fallbackResponse = 'В рамках школьной программы по математике изучаются алгебра, геометрия и начала математического анализа. Ключевые темы включают уравнения, функции, производные, интегралы, планиметрию и стереометрию. На ЕНТ часто встречаются задачи на решение уравнений, неравенств, задачи на оптимизацию и геометрические задачи.';
        } else if (input.toLowerCase().includes('физик')) {
          fallbackResponse = 'Школьный курс физики охватывает механику, термодинамику, электричество и магнетизм, оптику и элементы квантовой физики. На ЕНТ по физике проверяется умение применять формулы, законы и принципы для решения практических задач, понимание физических явлений и процессов.';
        } 
          else if (input.toLowerCase().includes('биолог')) {
          fallbackResponse = 'Школьный курс биологии охватывает клеточную структуру, генетику, анатомию человека, зоологию, ботанику и экологию. На ЕНТ по биологии проверяются знания о строении клеток, процессах жизнедеятельности организмов, функциях органов человека, законах наследственности и взаимодействии живых организмов с окружающей средой.';
        } else if (input.toLowerCase().includes('хими')) {
          fallbackResponse = 'Курс химии в школе включает основы общей, неорганической и органической химии. На ЕНТ по химии проверяются знания периодической системы элементов, степеней окисления, типов химических реакций, кислот и оснований, органических веществ (углеводороды, спирты, кислоты), а также умение решать задачи на массу, объем, молярную концентрацию и уравнивание реакций.';
        } else if (input.toLowerCase().includes('истори') || input.toLowerCase().includes('казахстан')) {
          fallbackResponse = 'История Казахстана — обязательный предмет на ЕНТ, охватывающий древнюю, средневековую, новую и новейшую историю страны. Темы включают ранние государства (Саки, Усунь, Тюркский каганат), Золотую Орду, Казахское ханство, колониальную политику Российской империи, период Советского Союза, обретение независимости и современное развитие Республики Казахстан.';
        }
        else {
          fallbackResponse = 'Я могу помочь вам с информацией по предметам ЕНТ, стратегиям подготовки и различным темам школьной программы. Вы можете задать более конкретный вопрос по интересующей вас теме, и я постараюсь предоставить полезную информацию.';
        }
        
        addAssistantResponse(fallbackResponse);
      }
    } catch (error) {
      console.error('Error getting response:', error);
      toast.error('Не удалось получить ответ');
      
      addAssistantResponse('Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const addAssistantResponse = (content: string) => {
    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content,
      timestamp: new Date(),
    };
    
    setConversations(prevConversations => {
      return prevConversations.map(conv => {
        if (conv.id === activeConversation) {
          const newTitle = conv.messages.length === 1 ? input.slice(0, 30) + (input.length > 30 ? '...' : '') : conv.title;
          
          return {
            ...conv,
            title: newTitle,
            messages: [...conv.messages, assistantMessage],
          };
        }
        return conv;
      });
    });
    
    setIsLoading(false);
  };
  
  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      title: 'Новый чат',
      lastMessage: 'Привет! Я ваш ЕНТ-ассистент. Чем я могу вам помочь?',
      timestamp: new Date(),
      messages: [
        {
          id: `welcome-${Date.now()}`,
          role: 'assistant',
          content: 'Привет! Я ваш ЕНТ-ассистент. Я могу помочь вам с подготовкой к экзамену, ответить на вопросы по школьной программе и объяснить сложные темы. Что вас интересует?',
          timestamp: new Date(),
        },
      ],
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversation(newConversation.id);
    inputRef.current?.focus();
  };
  
  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    
    if (activeConversation === id) {
      const remaining = conversations.filter(conv => conv.id !== id);
      if (remaining.length > 0) {
        setActiveConversation(remaining[0].id);
      } else {
        createNewConversation();
      }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };
  
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const filteredConversations = searchInput
    ? conversations.filter(conv => 
        conv.title.toLowerCase().includes(searchInput.toLowerCase()) ||
        conv.messages.some(msg => msg.content.toLowerCase().includes(searchInput.toLowerCase()))
      )
    : conversations;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
            <Card className="lg:col-span-1 h-full flex flex-col">
              <CardHeader className="px-4 py-3 space-y-2 border-b">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Чаты</CardTitle>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={createNewConversation}
                    title="Новый чат"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="relative">
                  <Input
                    placeholder="Поиск чатов..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-8"
                  />
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  {searchInput && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1.5 h-6 w-6"
                      onClick={() => setSearchInput('')}
                    >
                      <CloseIcon className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              
              <ScrollArea className="flex-1 p-2">
                {filteredConversations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Нет активных чатов</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredConversations.map((conv) => (
                      <div
                        key={conv.id}
                        className={`p-3 rounded-lg cursor-pointer flex flex-col hover:bg-muted transition-colors ${
                          activeConversation === conv.id ? 'bg-muted' : ''
                        }`}
                        onClick={() => setActiveConversation(conv.id)}
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium truncate">{conv.title}</h3>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(conv.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {conv.lastMessage}
                        </p>
                        
                        {activeConversation === conv.id && (
                          <div className="flex justify-end mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteConversation(conv.id);
                              }}
                            >
                              Удалить
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </Card>
            
            <Card className="lg:col-span-3 h-full flex flex-col">
              <CardHeader className="px-6 py-4 border-b">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src="/favicon.ico" alt="Shabyt AI" />
                    <AvatarFallback><Brain className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">ЕНТ Ассистент</CardTitle>
                    <p className="text-xs text-muted-foreground">Задавайте вопросы по школьной программе, ЕНТ и не только</p>
                  </div>
                </div>
              </CardHeader>
              
              <Tabs defaultValue="chat" className="flex-1 flex flex-col">
                <TabsList className="mx-6 mt-2 mb-4 grid grid-cols-3">
                  <TabsTrigger value="chat">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Чат
                  </TabsTrigger>
                  <TabsTrigger value="features">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Возможности
                  </TabsTrigger>
                  <TabsTrigger value="usage">
                    <Crown className="h-4 w-4 mr-2" />
                    Использование
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0 overflow-hidden">
                  <ScrollArea 
                    ref={scrollAreaRef} 
                    className="flex-1 px-6 overflow-y-auto"
                    style={{ height: "calc(100% - 160px)" }} // Ensure we leave space for the input area
                  >
                    <div className="space-y-6 py-4">
                      {getCurrentMessages().map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div className="flex items-start max-w-[80%]">
                            {message.role === 'assistant' && (
                              <Avatar className="h-8 w-8 mr-3 mt-1">
                                <AvatarImage src="/favicon.ico" alt="Shabyt AI" />
                                <AvatarFallback><Brain className="h-4 w-4" /></AvatarFallback>
                              </Avatar>
                            )}
                            
                            <div
                              className={`px-4 py-3 rounded-lg ${
                                message.role === 'user'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <div className="whitespace-pre-wrap text-sm">
                                {message.content}
                              </div>
                              <div className="text-xs mt-1 opacity-70 text-right">
                                {formatTimestamp(message.timestamp)}
                              </div>
                            </div>
                            
                            {message.role === 'user' && (
                              <Avatar className="h-8 w-8 ml-3 mt-1">
                                <AvatarImage 
                                  src="https://api.dicebear.com/7.x/initials/svg?seed=User" 
                                  alt="User" 
                                />
                                <AvatarFallback>U</AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="flex items-start max-w-[80%]">
                            <Avatar className="h-8 w-8 mr-3 mt-1">
                              <AvatarImage src="/favicon.ico" alt="Shabyt AI" />
                              <AvatarFallback><Brain className="h-4 w-4" /></AvatarFallback>
                            </Avatar>
                            
                            <div className="px-4 py-3 rounded-lg bg-muted">
                              <div className="flex items-center space-x-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-sm">Печатает...</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  
                  <div className="p-4 border-t">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                      <Textarea
                        ref={inputRef}
                        placeholder="Напишите сообщение..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 resize-none"
                        rows={1}
                        disabled={isLoading}
                      />
                      <Button 
                        type="submit" 
                        size="icon" 
                        disabled={isLoading || !input.trim()}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </form>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Используйте Enter для отправки, Shift+Enter для новой строки
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="features" className="flex-1 p-6 overflow-auto">
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Возможности ЕНТ-ассистента</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4 hover:bg-secondary/20 transition-colors">
                        <div className="flex items-start">
                          <div className="bg-primary/10 p-2 rounded-full mr-3">
                            <Book className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Подготовка к ЕНТ</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Получите ответы на вопросы по программе ЕНТ, разъяснения сложных тем и понятий.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 hover:bg-secondary/20 transition-colors">
                        <div className="flex items-start">
                          <div className="bg-primary/10 p-2 rounded-full mr-3">
                            <Calculator className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Решение задач</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Помощь в решении математических, физических и других задач с пошаговым объяснением.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 hover:bg-secondary/20 transition-colors">
                        <div className="flex items-start">
                          <div className="bg-primary/10 p-2 rounded-full mr-3">
                            <Image className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Визуализация</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Получите визуальные объяснения сложных концепций и процессов.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 hover:bg-secondary/20 transition-colors">
                        <div className="flex items-start">
                          <div className="bg-primary/10 p-2 rounded-full mr-3">
                            <Brain className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Интеллектуальный помощник</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Персональный помощник, который адаптируется к вашему уровню знаний и помогает улучшать результаты.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">Примеры запросов</h3>
                      
                      <div className="space-y-3">
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="font-medium">Объясни теорему Пифагора простыми словами</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Получите простое объяснение математических концепций
                          </p>
                        </div>
                        
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="font-medium">Как решить квадратное уравнение x² + 5x + 6 = 0?</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Пошаговое решение задач с объяснениями
                          </p>
                        </div>
                        
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="font-medium">Расскажи о важных событиях в истории Казахстана</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Получите информацию по исторической тематике
                          </p>
                        </div>
                        
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="font-medium">25 * 32 / 4 + 17</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Вычисление математических выражений
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="usage" className="flex-1 p-6 overflow-auto">
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Использование ассистента</h2>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="font-medium text-lg mb-3">Советы по эффективному использованию</h3>
                          
                          <ul className="space-y-3">
                            <li className="flex items-start">
                              <div className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                                <span className="text-xs font-bold text-primary px-1">1</span>
                              </div>
                              <div>
                                <p className="font-medium">Задавайте конкретные вопросы</p>
                                <p className="text-sm text-muted-foreground">
                                  Чем точнее вопрос, тем полезнее будет ответ. Вместо "Расскажи о математике" спросите "Объясни правило дифференцирования сложной функции".
                                </p>
                              </div>
                            </li>
                            
                            <li className="flex items-start">
                              <div className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                                <span className="text-xs font-bold text-primary px-1">2</span>
                              </div>
                              <div>
                                <p className="font-medium">Используйте контекст беседы</p>
                                <p className="text-sm text-muted-foreground">
                                  Ассистент запоминает предыдущие сообщения в разговор��, поэтому вы можете задавать уточняющие вопросы.
                                </p>
                              </div>
                            </li>
                            
                            <li className="flex items-start">
                              <div className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                                <span className="text-xs font-bold text-primary px-1">3</span>
                              </div>
                              <div>
                                <p className="font-medium">Проверяйте информацию</p>
                                <p className="text-sm text-muted-foreground">
                                  Ассистент стремится предоставлять точную информацию, но рекомендуется проверять важные данные в надежных источниках.
                                </p>
                              </div>
                            </li>
                            
                            <li className="flex items-start">
                              <div className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                                <span className="text-xs font-bold text-primary px-1">4</span>
                              </div>
                              <div>
                                <p className="font-medium">Оценивайте предоставленные ответы</p>
                                <p className="text-sm text-muted-foreground">
                                  Обратная связь помогает улучшать качество работы ассистента.
                                </p>
                              </div>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="font-medium text-lg mb-3">Ограничения</h3>
                          
                          <ul className="space-y-2">
                            <li className="text-sm flex items-start">
                              <div className="h-5 w-5 flex items-center justify-center mr-2">•</div>
                              <p>
                                Ассистент не имеет доступа к интернету и основывается на данных, доступных на момент его создания.
                              </p>
                            </li>
                            <li className="text-sm flex items-start">
                              <div className="h-5 w-5 flex items-center justify-center mr-2">•</div>
                              <p>
                                Могут быть ограничения в решении очень сложных или узкоспециализированных задач.
                              </p>
                            </li>
                            <li className="text-sm flex items-start">
                              <div className="h-5 w-5 flex items-center justify-center mr-2">•</div>
                              <p>
                                Ассистент не может выполнять действия вне платформы, такие как отправка электронной почты или доступ к файлам.
                              </p>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AIChatPage;
