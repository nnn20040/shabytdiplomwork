
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Award, Calendar, ClipboardCheck, Clock, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    school: '',
    grade: '',
    bio: '',
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call to fetch user profile
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        // Check if user is in localStorage first
        const storedUser = localStorage.getItem('user');
        const mockUser = storedUser 
          ? JSON.parse(storedUser)
          : {
              id: '1',
              name: 'Нурлан Алиев',
              email: 'nurlan@example.com',
              role: 'student',
              phone: '+7 (701) 123-4567',
              school: 'Школа №25',
              grade: '11',
              bio: 'Ученик 11 класса, готовлюсь к ЕНТ по направлению технических наук. Увлекаюсь математикой и физикой.',
              enrolledCourses: 4,
              completedCourses: 1,
              progress: 65,
              achievements: [
                { id: 1, title: 'Первые шаги', description: 'Завершен первый урок', icon: 'award', date: '2023-09-15' },
                { id: 2, title: 'Настойчивый ученик', description: 'Завершено 5 уроков подряд', icon: 'zap', date: '2023-09-20' },
                { id: 3, title: 'Математический гений', description: 'Получена оценка 95% на тесте по математике', icon: 'brain', date: '2023-10-05' },
              ],
              recentActivity: [
                { id: 1, type: 'course', title: 'Начат курс "Физика для ЕНТ"', date: '2023-10-10', link: '/course/2' },
                { id: 2, type: 'test', title: 'Пройден тест "Алгебраические выражения"', date: '2023-10-08', score: 85, link: '/course/1/test/2/results' },
                { id: 3, type: 'lesson', title: 'Завершен урок "Степени и корни"', date: '2023-10-05', link: '/course/1/learn' },
                { id: 4, type: 'discussion', title: 'Создано обсуждение "Вопрос по тригонометрии"', date: '2023-10-03', link: '/course/1/discussions/3' },
              ]
            };

        setUser(mockUser);
        setFormData({
          name: mockUser.name,
          email: mockUser.email,
          phone: mockUser.phone || '',
          school: mockUser.school || '',
          grade: mockUser.grade || '',
          bio: mockUser.bio || '',
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Ошибка при загрузке профиля');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be an API call to update user profile
    try {
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser);
      
      // Update localStorage
      if (localStorage.getItem('user')) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      setIsEditing(false);
      toast.success('Профиль успешно обновлен');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Ошибка при обновлении профиля');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <div className="h-64 bg-muted rounded-lg mb-6"></div>
                  <div className="h-48 bg-muted rounded-lg"></div>
                </div>
                <div className="lg:col-span-2">
                  <div className="h-96 bg-muted rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Профиль не найден</h1>
              <p className="text-muted-foreground mt-2">
                Пожалуйста, войдите в систему для просмотра своего профиля.
              </p>
              <Button className="mt-6" onClick={() => window.location.href = '/login'}>
                Войти
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8">Мой профиль</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Профиль</CardTitle>
                  <CardDescription>Ваша персональная информация</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
                    <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  
                  <h2 className="text-xl font-semibold mt-4">{user.name}</h2>
                  <Badge className="mt-2">{user.role === 'student' ? 'Студент' : 'Преподаватель'}</Badge>
                  
                  <div className="mt-4 text-left space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Email:</span>
                      <p>{user.email}</p>
                    </div>
                    {user.phone && (
                      <div>
                        <span className="text-sm text-muted-foreground">Телефон:</span>
                        <p>{user.phone}</p>
                      </div>
                    )}
                    {user.school && (
                      <div>
                        <span className="text-sm text-muted-foreground">Школа:</span>
                        <p>{user.school}</p>
                      </div>
                    )}
                    {user.grade && (
                      <div>
                        <span className="text-sm text-muted-foreground">Класс:</span>
                        <p>{user.grade}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setIsEditing(true)}
                  >
                    Редактировать профиль
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Progress Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Прогресс обучения</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Общий прогресс</span>
                    <span className="font-medium">{user.progress}%</span>
                  </div>
                  <Progress value={user.progress} className="h-2" />
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="border rounded-lg p-3 text-center">
                      <BookOpen className="h-6 w-6 mx-auto text-primary mb-1" />
                      <p className="text-2xl font-bold">{user.enrolledCourses}</p>
                      <p className="text-xs text-muted-foreground">Курсов записано</p>
                    </div>
                    <div className="border rounded-lg p-3 text-center">
                      <ClipboardCheck className="h-6 w-6 mx-auto text-green-500 mb-1" />
                      <p className="text-2xl font-bold">{user.completedCourses}</p>
                      <p className="text-xs text-muted-foreground">Курсов завершено</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="overview">Обзор</TabsTrigger>
                  <TabsTrigger value="edit-profile">Редактировать профиль</TabsTrigger>
                  <TabsTrigger value="achievements">Достижения</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>О себе</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{user.bio || 'Информация о себе не указана.'}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Недавняя активность</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {user.recentActivity && user.recentActivity.length > 0 ? (
                          user.recentActivity.map((activity: any) => (
                            <div 
                              key={activity.id} 
                              className="flex items-start py-3 border-b border-border last:border-0"
                            >
                              <div className="mr-4 mt-1">
                                {activity.type === 'course' && (
                                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <BookOpen className="h-5 w-5 text-blue-600" />
                                  </div>
                                )}
                                {activity.type === 'test' && (
                                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                                    <ClipboardCheck className="h-5 w-5 text-orange-600" />
                                  </div>
                                )}
                                {activity.type === 'lesson' && (
                                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                    <BookOpen className="h-5 w-5 text-green-600" />
                                  </div>
                                )}
                                {activity.type === 'discussion' && (
                                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                    <BookOpen className="h-5 w-5 text-purple-600" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <p className="font-medium">{activity.title}</p>
                                  <span className="text-sm text-muted-foreground">{activity.date}</span>
                                </div>
                                {activity.score !== undefined && (
                                  <p className="text-sm mt-1">
                                    Результат: <span className="font-medium">{activity.score}%</span>
                                  </p>
                                )}
                                {activity.link && (
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="p-0 h-auto mt-1"
                                    onClick={() => window.location.href = activity.link}
                                  >
                                    Подробнее
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-muted-foreground py-4">
                            Нет данных о недавней активности.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="edit-profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Редактировать профиль</CardTitle>
                      <CardDescription>
                        Обновите свою персональную информацию
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Полное имя</Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Телефон</Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="school">Школа</Label>
                            <Input
                              id="school"
                              name="school"
                              value={formData.school}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="grade">Класс</Label>
                            <Input
                              id="grade"
                              name="grade"
                              value={formData.grade}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="bio">О себе</Label>
                          <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            className="w-full min-h-[100px] p-2 border rounded-md bg-background"
                          />
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setFormData({
                                name: user.name,
                                email: user.email,
                                phone: user.phone || '',
                                school: user.school || '',
                                grade: user.grade || '',
                                bio: user.bio || '',
                              });
                              setActiveTab('overview');
                            }}
                          >
                            Отмена
                          </Button>
                          <Button type="submit">
                            Сохранить изменения
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="achievements">
                  <Card>
                    <CardHeader>
                      <CardTitle>Мои достижения</CardTitle>
                      <CardDescription>
                        Достижения, полученные в процессе обучения
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {user.achievements && user.achievements.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {user.achievements.map((achievement: any) => (
                            <div
                              key={achievement.id}
                              className="border rounded-lg p-4 hover:bg-secondary/40 transition-colors"
                            >
                              <div className="flex items-start">
                                <div className="mr-4">
                                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Award className="h-6 w-6 text-primary" />
                                  </div>
                                </div>
                                <div>
                                  <h3 className="font-medium">{achievement.title}</h3>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {achievement.description}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-2">
                                    Получено: {achievement.date}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Award className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                          <h3 className="text-lg font-medium mt-4">Нет достижений</h3>
                          <p className="text-muted-foreground mt-2">
                            Продолжайте обучение, чтобы получить свои первые достижения.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
