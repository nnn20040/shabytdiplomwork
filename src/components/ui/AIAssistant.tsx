
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Bot, X, Send, Loader2, MinusCircle, PlusCircle } from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const mockResponses = [
        'Отличный вопрос! Для подготовки к ЕНТ по этой теме я рекомендую сначала изучить основные концепции, а затем практиковаться с тестовыми заданиями.',
        'По этому вопросу есть несколько важных моментов, которые стоит учитывать при подготовке к ЕНТ. Давайте разберемся с каждым из них по порядку.',
        'На ЕНТ этой теме уделяется особое внимание. Предлагаю рассмотреть следующие ключевые аспекты, которые обязательно нужно знать.',
        'Я могу помочь вам с этим вопросом. Давайте разберем основные концепции и типичные задания, которые встречаются на ЕНТ по этой теме.',
        'Это важный вопрос для ЕНТ. Предлагаю разбить его на несколько частей для лучшего понимания.'
      ];

      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

      const aiMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: randomResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
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
            {isLoading && (
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
                disabled={isLoading || !input.trim()}
                onClick={handleSendMessage}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              ИИ-ассистент поможет с подготовкой к ЕНТ, объяснит темы и ответит на вопросы.
            </p>
          </div>
        </Card>
      )}
    </>
  );
};

export default AIAssistant;
