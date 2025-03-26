import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { AlertTriangle, Bell, CheckCircle, Lock, Moon, Shield, Smartphone, Volume2 } from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('account');
  
  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Notification settings
  const [notificationSettings, setNotificationSettings = useState({
    emailNotifications: true,
    courseUpdates: true,
    newMessages: true,
    testReminders: true,
    sound: true,
  });
  
  // Appearance settings
  const [appearanceSettings, setAppearanceSettings = useState({
    darkMode: false,
    highContrast: false,
    fontSize: 'medium',
    language: 'ru',
  });
  
  // Privacy settings
  const [privacySettings, setPrivacySettings = useState({
    showCourseProgress: true,
    shareActivity: true,
    twoFactorAuth: false,
  });
  
  // Handle notifications toggle
  const handleNotificationToggle = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    });
    toast.success(`Настройка "${setting}" обновлена`);
  };
  
  // Handle appearance toggle
  const handleAppearanceToggle = (setting: keyof typeof appearanceSettings) => {
    if (typeof appearanceSettings[setting] === 'boolean') {
      setAppearanceSettings({
        ...appearanceSettings,
        [setting]: !appearanceSettings[setting],
      });
      toast.success(`Настройка "${setting}" обновлена`);
    }
  };
  
  // Handle privacy toggle
  const handlePrivacyToggle = (setting: keyof typeof privacySettings) => {
    setPrivacySettings({
      ...privacySettings,
      [setting]: !privacySettings[setting],
    });
    toast.success(`Настройка "${setting}" обновлена`);
  };
  
  // Change password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Новые пароли не совпадают');
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error('Пароль должен содержать не менее 8 символов');
      return;
    }
    
    // In a real app, this would be an API call
    toast.success('Пароль успешно изменен');
    
    // Reset form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };
  
  // Delete account
  const handleDeleteAccount = () => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо.');
    
    if (confirmed) {
      // In a real app, this would be an API call
      toast.success('Ваш аккаунт был удален');
      localStorage.removeItem('user');
      sessionStorage.removeItem('isLoggedIn');
      window.location.href = '/';
    }
  };

  // Handle font size change
  const handleFontSizeChange = (size: string) => {
    setAppearanceSettings(prev => ({ ...prev, fontSize: size }));
    document.documentElement.style.fontSize = {
      small: '14px',
      medium: '16px',
      large: '18px'
    }[size] || '16px';
  };

  // Handle theme change
  const handleThemeChange = (setting: 'darkMode' | 'highContrast') => {
    setAppearanceSettings(prev => {
      const newSettings = { ...prev, [setting]: !prev[setting] };
      
      // Apply theme changes
      document.documentElement.classList.toggle('dark', newSettings.darkMode);
      document.documentElement.classList.toggle('high-contrast', newSettings.highContrast);
      
      return newSettings;
    });
  };

  // Handle language change
  const handleLanguageChange = (lang: string) => {
    setAppearanceSettings(prev => ({ ...prev, language: lang }));
    // Apply language change (you'll need to implement your translation system)
  };

  // Initialize theme and font size on mount
  useEffect(() => {
    if (appearanceSettings.darkMode) {
      document.documentElement.classList.add('dark');
    }
    if (appearanceSettings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    }
    handleFontSizeChange(appearanceSettings.fontSize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8">Настройки</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-0">
                  <Tabs 
                    defaultValue={activeTab} 
                    onValueChange={setActiveTab}
                    orientation="vertical"
                    className="w-full"
                  >
                    <TabsList className="flex flex-col w-full rounded-none h-auto justify-start">
                      <TabsTrigger 
                        value="account" 
                        className="justify-start px-4 py-3 data-[state=active]:bg-muted"
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Аккаунт
                      </TabsTrigger>
                      <TabsTrigger 
                        value="notifications" 
                        className="justify-start px-4 py-3 data-[state=active]:bg-muted"
                      >
                        <Bell className="h-4 w-4 mr-2" />
                        Уведомления
                      </TabsTrigger>
                      <TabsTrigger 
                        value="appearance" 
                        className="justify-start px-4 py-3 data-[state=active]:bg-muted"
                      >
                        <Moon className="h-4 w-4 mr-2" />
                        Внешний вид
                      </TabsTrigger>
                      <TabsTrigger 
                        value="privacy" 
                        className="justify-start px-4 py-3 data-[state=active]:bg-muted"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Приватность
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-3 space-y-6">
              {activeTab === 'account' && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Изменить пароль</CardTitle>
                      <CardDescription>
                        Обновите пароль для повышения безопасности вашей учетной записи
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleChangePassword} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Текущий пароль</Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">Новый пароль</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Подтвердите новый пароль</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                        </div>
                        
                        <Button type="submit">Изменить пароль</Button>
                      </form>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Удаление аккаунта</CardTitle>
                      <CardDescription>
                        Удаление аккаунта приведет к потере всех данных и необратимо
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Alert className="mb-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Это действие нельзя отменить. Все ваши данные будут удалены навсегда.
                        </AlertDescription>
                      </Alert>
                      
                      <Button 
                        variant="destructive" 
                        onClick={handleDeleteAccount}
                      >
                        Удалить аккаунт
                      </Button>
                    </CardContent>
                  </Card>
                </>
              )}
              
              {activeTab === 'notifications' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Настройки уведомлений</CardTitle>
                    <CardDescription>
                      Настройте, какие уведомления вы хотите получать
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Каналы уведомлений</h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="emailNotifications">Email уведомления</Label>
                          <p className="text-sm text-muted-foreground">
                            Получать уведомления на email
                          </p>
                        </div>
                        <Switch
                          id="emailNotifications"
                          checked={notificationSettings.emailNotifications}
                          onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="sound">Звуковые уведомления</Label>
                          <p className="text-sm text-muted-foreground">
                            Воспроизводить звук при получении уведомлений
                          </p>
                        </div>
                        <Switch
                          id="sound"
                          checked={notificationSettings.sound}
                          onCheckedChange={() => handleNotificationToggle('sound')}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Типы уведомлений</h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="courseUpdates">Обновления курсов</Label>
                          <p className="text-sm text-muted-foreground">
                            Уведомления о новых уроках и материалах
                          </p>
                        </div>
                        <Switch
                          id="courseUpdates"
                          checked={notificationSettings.courseUpdates}
                          onCheckedChange={() => handleNotificationToggle('courseUpdates')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="newMessages">Новые сообщения</Label>
                          <p className="text-sm text-muted-foreground">
                            Уведомления о новых сообщениях и ответах в обсуждениях
                          </p>
                        </div>
                        <Switch
                          id="newMessages"
                          checked={notificationSettings.newMessages}
                          onCheckedChange={() => handleNotificationToggle('newMessages')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="testReminders">Напоминания о тестах</Label>
                          <p className="text-sm text-muted-foreground">
                            Напоминания о предстоящих тестах и дедлайнах
                          </p>
                        </div>
                        <Switch
                          id="testReminders"
                          checked={notificationSettings.testReminders}
                          onCheckedChange={() => handleNotificationToggle('testReminders')}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === 'appearance' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Настройки внешнего вида</CardTitle>
                    <CardDescription>Настройте внешний вид платформы под свои предпочтения</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Тема</h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Темная тема</Label>
                          <p className="text-sm text-muted-foreground">Использовать темную тему интерфейса</p>
                        </div>
                        <Switch
                          checked={appearanceSettings.darkMode}
                          onCheckedChange={() => handleThemeChange('darkMode')}
                        />
                      </div>

                      {/* High contrast */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Высокий контраст</Label>
                          <p className="text-sm text-muted-foreground">Увеличить контрастность элементов</p>
                        </div>
                        <Switch
                          checked={appearanceSettings.highContrast}
                          onCheckedChange={() => handleThemeChange('highContrast')}
                        />
                      </div>

                      {/* Font size */}
                      <div className="space-y-2">
                        <Label>Размер шрифта</Label>
                        <select
                          className="w-full p-2 rounded-md border border-input bg-background"
                          value={appearanceSettings.fontSize}
                          onChange={(e) => handleFontSizeChange(e.target.value)}
                        >
                          <option value="small">Маленький</option>
                          <option value="medium">Средний</option>
                          <option value="large">Большой</option>
                        </select>
                      </div>

                      {/* Language */}
                      <div className="space-y-2">
                        <Label>Язык интерфейса</Label>
                        <select
                          className="w-full p-2 rounded-md border border-input bg-background"
                          value={appearanceSettings.language}
                          onChange={(e) => handleLanguageChange(e.target.value)}
                        >
                          <option value="ru">Русский</option>
                          <option value="kk">Қазақша</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === 'privacy' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Настройки приватности</CardTitle>
                    <CardDescription>
                      Управляйте тем, кто может видеть вашу информацию и активность
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Активность</h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="showCourseProgress">Показывать прогресс по курсам</Label>
                          <p className="text-sm text-muted-foreground">
                            Другие студенты смогут видеть ваш прогресс по курсам
                          </p>
                        </div>
                        <Switch
                          id="showCourseProgress"
                          checked={privacySettings.showCourseProgress}
                          onCheckedChange={() => handlePrivacyToggle('showCourseProgress')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="shareActivity">Делиться активностью</Label>
                          <p className="text-sm text-muted-foreground">
                            Показывать вашу активность в ленте новостей
                          </p>
                        </div>
                        <Switch
                          id="shareActivity"
                          checked={privacySettings.shareActivity}
                          onCheckedChange={() => handlePrivacyToggle('shareActivity')}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Безопасность</h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="twoFactorAuth">Двухфакторная аутентификация</Label>
                          <p className="text-sm text-muted-foreground">
                            Повысьте безопасность аккаунта с помощью 2FA
                          </p>
                        </div>
                        <Switch
                          id="twoFactorAuth"
                          checked={privacySettings.twoFactorAuth}
                          onCheckedChange={() => handlePrivacyToggle('twoFactorAuth')}
                        />
                      </div>
                      
                      {privacySettings.twoFactorAuth && (
                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>
                            Двухфакторная аутентификация включена. Для входа в аккаунт вам потребуется ввести код из SMS.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SettingsPage;
