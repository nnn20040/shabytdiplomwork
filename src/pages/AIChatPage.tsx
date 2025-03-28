
import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendHorizontal, Loader2, Plus, Trash2, Search, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { askAI, getFallbackResponse } from '@/services/aiService';
import { useLanguage } from '@/contexts/LanguageContext';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

// Type for chat messages
type Message = {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

// Type for chat history
type ChatHistory = {
  id: number;
  title: string;
  messages: Message[];
  timestamp: Date;
};

const AIChatPage = () => {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentChatId, setCurrentChatId] = useState<number>(1);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([
    {
      id: 1,
      title: 'Новый чат',
      messages: [
        {
          id: 1,
          text: 'Привет! Я AI-ассистент Shabyt. Чем я могу помочь вам сегодня? Задайте мне вопрос по образовательным темам.',
          isUser: false,
          timestamp: new Date(),
        },
      ],
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [selectedChats, setSelectedChats] = useState<number[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Get current chat
  const currentChat = chatHistories.find(chat => chat.id === currentChatId) || chatHistories[0];

  // Filter chat histories based on search query
  const filteredChatHistories = chatHistories.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.messages.some(msg => msg.text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [currentChat?.messages]);

  // Load chat histories from local storage
  useEffect(() => {
    const savedChats = localStorage.getItem('shabytChatHistories');
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats);
        // Convert string timestamps back to Date objects
        const processedChats = parsedChats.map((chat: any) => ({
          ...chat,
          timestamp: new Date(chat.timestamp),
          messages: chat.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));
        setChatHistories(processedChats);
        
        // Set current chat to the last one
        if (processedChats.length > 0) {
          setCurrentChatId(processedChats[processedChats.length - 1].id);
        }
      } catch (error) {
        console.error('Error parsing chat histories:', error);
      }
    }
  }, []);

  // Save chat histories to local storage
  useEffect(() => {
    localStorage.setItem('shabytChatHistories', JSON.stringify(chatHistories));
  }, [chatHistories]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      isUser: true,
      timestamp: new Date(),
    };

    // Update chat title if it's the first user message
    let updatedHistories = chatHistories.map(chat => {
      if (chat.id === currentChatId) {
        // Update title to first few words of first user message if it's "Новый чат"
        let title = chat.title;
        if (chat.title === 'Новый чат' && chat.messages.filter(m => m.isUser).length === 0) {
          title = input.slice(0, 30) + (input.length > 30 ? '...' : '');
        }
        
        return {
          ...chat,
          title,
          messages: [...chat.messages, userMessage],
          timestamp: new Date(),
        };
      }
      return chat;
    });

    setChatHistories(updatedHistories);
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

      setChatHistories(prev => prev.map(chat => {
        if (chat.id === currentChatId) {
          return {
            ...chat,
            messages: [...chat.messages, aiResponse],
          };
        }
        return chat;
      }));
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Извините, произошла ошибка при получении ответа. Пожалуйста, попробуйте еще раз позже.',
        isUser: false,
        timestamp: new Date(),
      };
      setChatHistories(prev => prev.map(chat => {
        if (chat.id === currentChatId) {
          return {
            ...chat,
            messages: [...chat.messages, errorMessage],
          };
        }
        return chat;
      }));
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

  const createNewChat = () => {
    const newChatId = Date.now();
    const newChat = {
      id: newChatId,
      title: 'Новый чат',
      messages: [
        {
          id: newChatId + 1,
          text: 'Привет! Я AI-ассистент Shabyt. Чем я могу помочь вам сегодня? Задайте мне вопрос по образовательным темам.',
          isUser: false,
          timestamp: new Date(),
        },
      ],
      timestamp: new Date(),
    };
    
    setChatHistories([...chatHistories, newChat]);
    setCurrentChatId(newChatId);
  };

  const deleteSelectedChats = () => {
    if (selectedChats.length === 0) return;
    
    const updatedHistories = chatHistories.filter(chat => !selectedChats.includes(chat.id));
    setChatHistories(updatedHistories);
    setSelectedChats([]);
    
    // If current chat is deleted, set to the first available chat or create a new one
    if (selectedChats.includes(currentChatId)) {
      if (updatedHistories.length > 0) {
        setCurrentChatId(updatedHistories[0].id);
      } else {
        createNewChat();
      }
    }
    
    toast.success(`Удалено ${selectedChats.length} чатов`);
  };

  const toggleChatSelection = (chatId: number) => {
    if (selectedChats.includes(chatId)) {
      setSelectedChats(selectedChats.filter(id => id !== chatId));
    } else {
      setSelectedChats([...selectedChats, chatId]);
    }
  };

  const selectChat = (chatId: number) => {
    setCurrentChatId(chatId);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout>
      <div className="container py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row h-[700px] gap-4">
          {/* Sidebar */}
          <div className={`w-full md:w-80 flex-shrink-0 transition-all duration-300 ${isMenuOpen ? 'block' : 'hidden md:block'}`}>
            <Card className="h-full shadow-md flex flex-col">
              <CardHeader className="border-b p-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{t('ai.chats') || 'Чаты'}</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
                <div className="relative mt-2">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('ai.search_chats') || "Поиск чатов..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </CardHeader>
              
              <div className="p-3 border-b">
                <div className="flex space-x-2">
                  <Button onClick={createNewChat} className="flex-1">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('ai.new_chat') || 'Новый чат'}
                  </Button>
                  {selectedChats.length > 0 && (
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={deleteSelectedChats}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              <ScrollArea className="flex-1 h-0">
                <div className="p-3 space-y-2">
                  {filteredChatHistories.length > 0 ? (
                    filteredChatHistories.map((chat) => (
                      <div
                        key={chat.id}
                        className={`flex items-center p-2 rounded-md cursor-pointer group ${
                          currentChatId === chat.id
                            ? 'bg-primary/10'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <Checkbox
                          checked={selectedChats.includes(chat.id)}
                          onCheckedChange={() => toggleChatSelection(chat.id)}
                          className="mr-2"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div 
                          className="flex-1 truncate" 
                          onClick={() => selectChat(chat.id)}
                        >
                          <p className="font-medium truncate">{chat.title}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {formatDate(chat.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      {searchQuery ? 'Чаты не найдены' : 'Нет чатов'}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </Card>
          </div>

          {/* Chat Area */}
          <Card className="flex-1 shadow-md flex flex-col h-full">
            <CardHeader className="border-b">
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2 md:hidden"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <CardTitle className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src="/placeholder.svg" alt="AI" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <span>Shabyt AI</span>
                </CardTitle>
              </div>
            </CardHeader>
            
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                <div className="flex flex-col space-y-4">
                  {currentChat?.messages.map((message) => (
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
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AIChatPage;
