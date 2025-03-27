
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
    'settings.2fa': 'Двухфакторная аутентификация',
    'settings.2fa.enable': 'Включить 2FA',
    'settings.2fa.disable': 'Отключить 2FA',
    'settings.save': 'Сохранить изменения',
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
    'settings.2fa': 'Екі факторлы аутентификация',
    'settings.2fa.enable': '2FA қосу',
    'settings.2fa.disable': '2FA өшіру',
    'settings.save': 'Өзгерістерді сақтау',
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
    return translations[language][key as keyof typeof translations[typeof language]] || key;
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
