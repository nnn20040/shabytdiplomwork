
import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendHorizontal, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { askAI, getFallbackResponse } from '@/services/aiService';
import { useLanguage } from '@/contexts/LanguageContext';

const AIChatPage = () => {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ id: number; text: string; isUser: boolean; timestamp: Date }>>([
    {
      id: 1,
      text: 'Привет! Я AI-ассистент Shabyt. Чем я могу помочь вам сегодня? Задайте мне вопрос по образовательным темам.',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

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
      // Use AI service to get response
      const response = await askAI(input);
      
      const aiResponse = {
        id: Date.now() + 1,
        text: response.text,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Layout>
      <div className="container py-8 max-w-4xl">
        <Card className="w-full shadow-md">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src="/placeholder.svg" alt="AI" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <span>{t('ai.assistant') || 'ИИ-ассистент'}</span>
            </CardTitle>
          </CardHeader>
          
          <div className="flex flex-col h-[600px]">
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full p-4">
                <div className="flex flex-col space-y-4">
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
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted dark:bg-gray-800'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
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
                        <p className="text-sm">{t('ai.thinking') || 'Думаю...'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
            
            <CardContent className="p-4 border-t mt-auto">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder={t('ai.enter_message') || "Введите сообщение..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={loading || !input.trim()}
                  size="icon"
                >
                  <SendHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default AIChatPage;
