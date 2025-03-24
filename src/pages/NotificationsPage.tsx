
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCheck, Calendar, MessageSquare, BookOpen, Award } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'course' | 'message' | 'system' | 'achievement';
  read: boolean;
  timestamp: Date;
  sender?: {
    name: string;
    avatar?: string;
  };
  link?: string;
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      // In a real app, this would be an API call
      setTimeout(() => {
        const mockNotifications: Notification[] = [
          {
            id: '1',
            title: 'Новый урок доступен',
            message: 'В курсе "Математика для ЕНТ" добавлен новый урок "Тригонометрические функции"',
            type: 'course',
            read: false,
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
            link: '/course/1/learn'
          },
          {
            id: '2',
            title: 'Напоминание о тесте',
            message: 'Завтра состоится тест по теме "Алгебраические выражения". Не забудьте подготовиться!',
            type: 'course',
            read: false,
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            link: '/course/1/test/2'
          },
          {
            id: '3',
            title: 'Новое сообщение',
            message: 'Асанов Болат ответил на ваш вопрос в обсуждении "Решение квадратных уравнений"',
            type: 'message',
            read: true,
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            sender: {
              name: 'Асанов Болат',
              avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
            },
            link: '/course/1/discussions/5'
          },
          {
            id: '4',
            title: 'Обновление системы',
            message: 'Мы обновили платформу! Теперь доступны новые функции для более эффективного обучения.',
            type: 'system',
            read: true,
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          },
          {
            id: '5',
            title: 'Достижение разблокировано',
            message: 'Поздравляем! Вы получили достижение "Настойчивый ученик" за завершение 5 уроков подряд.',
            type: 'achievement',
            read: false,
            timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
            link: '/profile/achievements'
          }
        ];
        
        setNotifications(mockNotifications);
        setIsLoading(false);
      }, 800);
    };
    
    fetchNotifications();
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };

  const getFilteredNotifications = () => {
    if (activeTab === 'all') {
      return notifications;
    }
    return notifications.filter(notification => notification.type === activeTab);
  };

  const getUnreadCount = () => {
    return notifications.filter(notification => !notification.read).length;
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className="h-5 w-5 text-blue-500" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case 'system':
        return <Bell className="h-5 w-5 text-purple-500" />;
      case 'achievement':
        return <Award className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const formatTimestamp = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true, locale: ru });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Уведомления</h1>
              <p className="text-muted-foreground">
                Просмотр всех ваших уведомлений и обновлений
              </p>
            </div>
            
            <div className="flex items-center">
              {getUnreadCount() > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="flex items-center"
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Отметить все как прочитанные
                </Button>
              )}
            </div>
          </div>
          
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="all" className="relative">
                  Все
                  {getUnreadCount() > 0 && (
                    <Badge className="ml-2 bg-primary text-white">{getUnreadCount()}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="course">Курсы</TabsTrigger>
                <TabsTrigger value="message">Сообщения</TabsTrigger>
                <TabsTrigger value="system">Система</TabsTrigger>
                <TabsTrigger value="achievement">Достижения</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value={activeTab} className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-5 bg-muted rounded w-1/3 mb-4"></div>
                        <div className="h-4 bg-muted rounded w-full mb-2"></div>
                        <div className="h-4 bg-muted rounded w-2/3"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : getFilteredNotifications().length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Нет уведомлений</h3>
                  <p className="text-muted-foreground">
                    У вас нет уведомлений в этой категории.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getFilteredNotifications().map((notification) => (
                    <Card
                      key={notification.id}
                      className={`transition-all hover:shadow-md ${
                        !notification.read ? 'border-l-4 border-l-primary' : ''
                      }`}
                    >
                      <CardContent className="p-5">
                        <div className="flex">
                          <div className="mr-4 mt-1 flex-shrink-0">
                            {notification.sender ? (
                              <Avatar>
                                <AvatarImage src={notification.sender.avatar} alt={notification.sender.name} />
                                <AvatarFallback>
                                  {notification.sender.name.substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                {getTypeIcon(notification.type)}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <h3 className={`text-lg font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                                {notification.title}
                              </h3>
                              <div className="flex items-center ml-4">
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {formatTimestamp(notification.timestamp)}
                                </span>
                              </div>
                            </div>
                            
                            <p className="mt-1 text-muted-foreground">
                              {notification.message}
                            </p>
                            
                            <div className="mt-3 flex justify-between items-center">
                              {notification.link ? (
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="p-0 h-auto"
                                  onClick={() => window.location.href = notification.link!}
                                >
                                  Подробнее
                                </Button>
                              ) : (
                                <div></div>
                              )}
                              
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  Отметить как прочитанное
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotificationsPage;
