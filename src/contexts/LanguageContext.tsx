
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ru' | 'kz';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations = {
  ru: {
    // Common
    'app.name': 'Shabyt',
    'nav.home': 'Главная',
    'nav.courses': 'Курсы',
    'nav.dashboard': 'Кабинет',
    'nav.login': 'Войти',
    'nav.register': 'Регистрация',
    'nav.logout': 'Выйти',
    
    // Auth
    'auth.login': 'Войти',
    'auth.register': 'Зарегистрироваться',
    'auth.email': 'Электронная почта',
    'auth.password': 'Пароль',
    'auth.forgot_password': 'Забыли пароль?',
    'auth.no_account': 'Ещё нет аккаунта?',
    'auth.have_account': 'Уже есть аккаунт?',
    
    // Courses
    'courses.all': 'Все курсы',
    'courses.my': 'Мои курсы',
    'course.lessons': 'Уроки',
    'course.start': 'Начать обучение',
    'course.continue': 'Продолжить обучение',
    
    // Settings
    'settings.title': 'Настройки',
    'settings.language': 'Язык интерфейса',
    'settings.language.ru': 'Русский',
    'settings.language.kz': 'Қазақша',
    'settings.contrast': 'Высокий контраст',
    'settings.save': 'Сохранить изменения',
    'settings.profile': 'Профиль',
    'settings.account': 'Аккаунт',
    'settings.appearance': 'Внешний вид',
    'settings.notifications': 'Уведомления',
    'settings.profile_information': 'Информация профиля',
    'settings.profile_description': 'Обновите информацию вашего профиля',
    'settings.name': 'Имя',
    'settings.email': 'Email',
    'settings.change_password': 'Изменить пароль',
    'settings.password_description': 'Обновите пароль для вашего аккаунта',
    'settings.current_password': 'Текущий пароль',
    'settings.new_password': 'Новый пароль',
    'settings.confirm_password': 'Подтвердите пароль',
    'settings.update_password': 'Обновить пароль',
    'settings.appearance_description': 'Настройте внешний вид',
    'settings.select_language': 'Выберите язык',
    'settings.contrast_description': 'Увеличивает контрастность для улучшения читаемости',
    'settings.notifications_description': 'Настройте уведомления',
    'settings.push_notifications': 'Push-уведомления',
    'settings.push_description': 'Получайте уведомления в браузере',
    'settings.email_notifications': 'Email-уведомления',
    'settings.email_description': 'Получайте уведомления на почту',
    'settings.saved_profile': 'Профиль успешно обновлен',
    'settings.password_mismatch': 'Пароли не совпадают',
    'settings.password_short': 'Пароль должен быть не менее 8 символов',
    'settings.password_changed': 'Пароль успешно изменен',
  },
  kz: {
    // Common
    'app.name': 'Shabyt',
    'nav.home': 'Басты бет',
    'nav.courses': 'Курстар',
    'nav.dashboard': 'Жеке кабинет',
    'nav.login': 'Кіру',
    'nav.register': 'Тіркелу',
    'nav.logout': 'Шығу',
    
    // Auth
    'auth.login': 'Кіру',
    'auth.register': 'Тіркелу',
    'auth.email': 'Электрондық пошта',
    'auth.password': 'Құпия сөз',
    'auth.forgot_password': 'Құпия сөзді ұмыттыңыз ба?',
    'auth.no_account': 'Әлі тіркелмегенсіз бе?',
    'auth.have_account': 'Тіркелгіңіз бар ма?',
    
    // Courses
    'courses.all': 'Барлық курстар',
    'courses.my': 'Менің курстарым',
    'course.lessons': 'Сабақтар',
    'course.start': 'Оқуды бастау',
    'course.continue': 'Оқуды жалғастыру',
    
    // Settings
    'settings.title': 'Параметрлер',
    'settings.language': 'Интерфейс тілі',
    'settings.language.ru': 'Орысша',
    'settings.language.kz': 'Қазақша',
    'settings.contrast': 'Жоғары контраст',
    'settings.save': 'Өзгерістерді сақтау',
    'settings.profile': 'Профиль',
    'settings.account': 'Аккаунт',
    'settings.appearance': 'Сыртқы түрі',
    'settings.notifications': 'Хабарландырулар',
    'settings.profile_information': 'Профиль ақпараты',
    'settings.profile_description': 'Профиль ақпаратын жаңарту',
    'settings.name': 'Аты',
    'settings.email': 'Email',
    'settings.change_password': 'Құпия сөзді өзгерту',
    'settings.password_description': 'Аккаунтыңыздың құпия сөзін жаңарту',
    'settings.current_password': 'Ағымдағы құпия сөз',
    'settings.new_password': 'Жаңа құпия сөз',
    'settings.confirm_password': 'Құпия сөзді растау',
    'settings.update_password': 'Құпия сөзді жаңарту',
    'settings.appearance_description': 'Сыртқы түрін баптау',
    'settings.select_language': 'Тілді таңдаңыз',
    'settings.contrast_description': 'Оқуды жақсарту үшін контрастты арттыру',
    'settings.notifications_description': 'Хабарландыруларды баптау',
    'settings.push_notifications': 'Push-хабарландырулар',
    'settings.push_description': 'Браузердегі хабарландыруларды алу',
    'settings.email_notifications': 'Email-хабарландырулар',
    'settings.email_description': 'Электрондық поштаға хабарландыруларды алу',
    'settings.saved_profile': 'Профиль сәтті жаңартылды',
    'settings.password_mismatch': 'Құпия сөздер сәйкес келмейді',
    'settings.password_short': 'Құпия сөз кемінде 8 таңбадан тұруы керек',
    'settings.password_changed': 'Құпия сөз сәтті өзгертілді',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as Language) || 'ru';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  // Translation function
  const t = (key: string): string => {
    const langDict = translations[language];
    if (!langDict) return key;
    return (langDict as any)[key] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
