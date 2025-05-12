
import React, { useState, useRef, useEffect } from 'react';
import { X, MessageSquare, SendHorizontal, Loader2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { aiApi } from '@/api';

type Message = {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  // Toggle the chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
    // If opening for the first time, add welcome message
    if (!isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          isUser: false,
          text: 'Привет! Я AI-ассистент Shabyt. Чем я могу помочь вам сегодня? Задайте мне вопрос по образовательным темам.',
          timestamp: new Date(),
        },
      ]);
    }
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Call API to get AI response
      const response = await aiApi.askQuestion(input);
      
      // If we got a successful response from the backend
      if (response && response.data) {
        const aiResponse = {
          id: Date.now() + 1,
          text: response.data.response || 'Извините, произошла ошибка при получении ответа.',
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
      } else {
        // Fallback response if we didn't get a proper response
        const errorMessage = {
          id: Date.now() + 1,
          text: 'Извините, произошла ошибка при получении ответа. Пожалуйста, попробуйте еще раз позже.',
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Извините, произошла ошибка при получении ответа. Пожалуйста, попробуйте еще раз позже.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat button */}
      <Button
        className="fixed right-6 bottom-6 rounded-full w-12 h-12 p-0 shadow-lg"
        onClick={toggleChat}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </Button>

      {/* Chat window */}
      {isOpen && (
        <Card className="fixed right-6 bottom-20 w-[350px] md:w-[400px] lg:w-[450px] shadow-xl border border-gray-200 dark:border-gray-800 z-50">
          <CardHeader className="p-4 border-b">
            <CardTitle className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src="/placeholder.svg" alt="AI" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <span>Shabyt AI-ассистент</span>
            </CardTitle>
          </CardHeader>
          
          <ScrollArea ref={scrollAreaRef} className="h-[350px] p-4 flex flex-col space-y-4 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isUser
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-muted dark:bg-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-muted dark:bg-gray-800 flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p className="text-sm">Думаю...</p>
                </div>
              </div>
            )}
          </ScrollArea>
          
          <CardFooter className="p-4 border-t">
            <div className="flex w-full items-center space-x-2">
              <Input
                placeholder="Введите сообщение..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={loading || !input.trim()}
              >
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default AIAssistant;
