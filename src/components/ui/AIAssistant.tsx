
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Bot, X, Send, Loader2, MinusCircle, RefreshCw } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Привет! Я ваш ИИ-ассистент для подготовки к ЕНТ. Чем я могу вам помочь сегодня?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
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

  // Fetch conversation history if authenticated
  const { data: historyData } = useQuery({
    queryKey: ['aiHistory'],
    queryFn: async () => {
      if (!isAuthenticated) return null;
      
      const token = localStorage.getItem('token');
      const response = await fetch('/api/ai/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      
      return response.json();
    },
    enabled: isAuthenticated && isOpen,
    retry: false,
    // Updated: Use meta for handling error instead of onError
    meta: {
      onError: () => {
        // Silently fail on error - we'll use the default welcome message
      }
    }
  });

  // Load conversation history when available
  useEffect(() => {
    if (historyData?.success && historyData.data.length > 0) {
      const historicalMessages: Message[] = [
        {
          id: '1',
          role: 'assistant',
          content: 'Привет! Я ваш ИИ-ассистент для подготовки к ЕНТ. Чем я могу вам помочь сегодня?',
          timestamp: new Date(),
        },
        ...historyData.data.map((item: any) => ([
          {
            id: `q-${item.id}`,
            role: 'user' as const,
            content: item.question,
            timestamp: new Date(item.created_at),
          },
          {
            id: `a-${item.id}`,
            role: 'assistant' as const,
            content: item.response,
            timestamp: new Date(item.created_at),
          }
        ])).flat()
      ];
      
      setMessages(historicalMessages);
    }
  }, [historyData]);

  // Ask AI question mutation
  const askMutation = useMutation({
    mutationFn: async (question: string) => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ question })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }
      
      return response.json();
    },
    onError: () => {
      toast.error('Не удалось получить ответ. Пожалуйста, попробуйте позже.');
      setMessages(prev => [
        ...prev, 
        {
          id: Date.now().toString() + '-error',
          role: 'assistant',
          content: 'Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте позже.',
          timestamp: new Date(),
        }
      ]);
    }
  });

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const userQuestion = input.trim();

    if (isAuthenticated) {
      try {
        const result = await askMutation.mutateAsync(userQuestion);
        
        if (result.success) {
          const aiMessage: Message = {
            id: Date.now().toString() + '-ai',
            role: 'assistant',
            content: result.data.response,
            timestamp: new Date(),
          };
          
          setMessages((prev) => [...prev, aiMessage]);
        }
      } catch (error) {
        // Error handled in mutation onError
      }
    } else {
      // Fallback for unauthenticated users - simulate response
      setTimeout(() => {
        let response = 'Для получения точных ответов, пожалуйста, войдите в систему.';
        
        // Basic math parser for demo purposes
        if (/^[\d\s+\-*/().]+$/.test(userQuestion)) {
          try {
            // Simple and unsafe evaluation for demo
            // eslint-disable-next-line no-eval
            const result = eval(userQuestion);
            response = `${result}`;
          } catch {
            response = 'Не удалось вычислить выражение. Пожалуйста, проверьте синтаксис.';
          }
        }
        
        const aiMessage: Message = {
          id: Date.now().toString() + '-ai',
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, aiMessage]);
      }, 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Привет! Я ваш ИИ-ассистент для подготовки к ЕНТ. Чем я могу вам помочь сегодня?',
        timestamp: new Date(),
      },
    ]);
    toast.success('История сообщений очищена');
  };

  return (
    <>
      {/* Chat button */}
      <Button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 p-0 shadow-lg z-50"
        variant="default"
        size="icon"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </Button>

      {/* Chat window */}
      {isOpen && (
        <Card className="fixed bottom-20 right-4 w-80 sm:w-96 h-[500px] shadow-xl z-50 flex flex-col">
          <div className="p-3 bg-primary text-primary-foreground flex items-center justify-between rounded-t-lg">
            <div className="flex items-center">
              <Bot className="h-5 w-5 mr-2" />
              <span className="font-medium">ИИ-Ассистент ЕНТ</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={clearChat}
                className="h-7 w-7 text-primary-foreground hover:text-primary-foreground/90 hover:bg-primary-foreground/10"
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="h-7 w-7 text-primary-foreground hover:text-primary-foreground/90 hover:bg-primary-foreground/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-secondary/30">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-4 flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border/50'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.role === 'user'
                        ? 'text-primary-foreground/70'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
            {askMutation.isPending && (
              <div className="mb-4 flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-card border border-border/50">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <p className="text-sm text-muted-foreground">
                      Печатает...
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t">
            <div className="flex items-end">
              <Textarea
                ref={inputRef}
                placeholder="Введите ваш вопрос..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-10 resize-none"
                rows={2}
              />
              <Button
                className="ml-2 h-10 w-10 p-0"
                disabled={askMutation.isPending || !input.trim()}
                onClick={handleSendMessage}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {!isAuthenticated 
                ? "Войдите в аккаунт для сохранения истории общения с ассистентом." 
                : "ИИ-ассистент поможет с подготовкой к ЕНТ, объяснит темы и ответит на вопросы."}
            </p>
          </div>
        </Card>
      )}
    </>
  );
};

export default AIAssistant;
