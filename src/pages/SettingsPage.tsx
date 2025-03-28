
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ApiKeySettings } from '@/components/settings/ApiKeySettings';

const SettingsPage = () => {
  const { language, setLanguage, t } = useLanguage();
  const { highContrast, toggleHighContrast, darkMode, toggleDarkMode } = useTheme();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  
  useEffect(() => {
    // Загрузка данных пользователя из localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, []);
  
  const handleSaveProfile = () => {
    // Сохранение обновленных данных пользователя в localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      const updatedUser = {
        ...user,
        name,
        email
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    toast.success(t('settings.saved_profile'));
  };
  
  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error(t('settings.password_mismatch'));
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error(t('settings.password_short'));
      return;
    }
    
    toast.success(t('settings.password_changed'));
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };
  
  return (
    <Layout>
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">{t('settings.title')}</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="profile">{t('settings.profile')}</TabsTrigger>
            <TabsTrigger value="account">{t('settings.account')}</TabsTrigger>
            <TabsTrigger value="appearance">{t('settings.appearance')}</TabsTrigger>
            <TabsTrigger value="notifications">{t('settings.notifications')}</TabsTrigger>
            <TabsTrigger value="ai">AI ассистент</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.profile_information')}</CardTitle>
                <CardDescription>{t('settings.profile_description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('settings.name')}</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">{t('settings.email')}</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                
                <Button onClick={handleSaveProfile}>{t('settings.save')}</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('settings.change_password')}</CardTitle>
                  <CardDescription>{t('settings.password_description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">{t('settings.current_password')}</Label>
                    <Input 
                      id="current-password" 
                      type="password" 
                      value={currentPassword} 
                      onChange={(e) => setCurrentPassword(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">{t('settings.new_password')}</Label>
                    <Input 
                      id="new-password" 
                      type="password" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">{t('settings.confirm_password')}</Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                    />
                  </div>
                  
                  <Button onClick={handleChangePassword}>{t('settings.update_password')}</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.appearance')}</CardTitle>
                <CardDescription>{t('settings.appearance_description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="language">{t('settings.language')}</Label>
                  <Select value={language} onValueChange={(value) => setLanguage(value as 'ru' | 'kz')}>
                    <SelectTrigger id="language">
                      <SelectValue placeholder={t('settings.select_language')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ru">{t('settings.language.ru')}</SelectItem>
                      <SelectItem value="kz">{t('settings.language.kz')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('settings.darkMode')}</p>
                    <p className="text-sm text-muted-foreground">{t('settings.darkMode.description')}</p>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('settings.contrast')}</p>
                    <p className="text-sm text-muted-foreground">{t('settings.contrast_description')}</p>
                  </div>
                  <Switch checked={highContrast} onCheckedChange={toggleHighContrast} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.notifications')}</CardTitle>
                <CardDescription>{t('settings.notifications_description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('settings.push_notifications')}</p>
                    <p className="text-sm text-muted-foreground">{t('settings.push_description')}</p>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('settings.email_notifications')}</p>
                    <p className="text-sm text-muted-foreground">{t('settings.email_description')}</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ai">
            <ApiKeySettings />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SettingsPage;
