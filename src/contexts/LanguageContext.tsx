
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
    'common.save': 'Сохранить',
    'common.cancel': 'Отмена',
    'common.saving': 'Сохранение...',
    
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
    
    // Lessons
    'lesson.create': 'Создание урока',
    'lesson.info': 'Информация об уроке',
    'lesson.title': 'Название урока',
    'lesson.title_placeholder': 'Например: Введение в линейные уравнения',
    'lesson.description': 'Краткое описание',
    'lesson.description_placeholder': 'Краткое описание содержания урока',
    'lesson.video_url': 'URL видео (YouTube, Vimeo и т.д.)',
    'lesson.order': 'Порядковый номер',
    'lesson.content': 'Содержание урока (теоретический материал)',
    'lesson.content_placeholder': 'Полное содержание урока, включая теорию, формулы, примеры...',
    
    // Tests
    'test.create': 'Создание теста',
    'test.edit': 'Редактирование теста',
    'test.title': 'Название теста',
    'test.description': 'Описание теста',
    'test.time_limit': 'Ограничение по времени (минуты)',
    'test.passing_score': 'Проходной балл (%)',
    'test.questions': 'Вопросы',
    'test.add_question': 'Добавить вопрос',
    
    // Students page
    'students.title': 'Студенты',
    'students.list': 'Список всех студентов',
    'students.list_description': 'Просмотр прогресса и взаимодействие со студентами',
    'students.name': 'Имя',
    'students.email': 'Email',
    'students.progress': 'Прогресс',
    'students.last_active': 'Последняя активность',
    'students.status': 'Статус',
    'students.actions': 'Действия',
    'students.view_progress': 'Прогресс',
    'students.send_message': 'Сообщение',
    'students.active': 'Активен',
    'students.inactive': 'Неактивен',
    'students.daily_activity': 'Ежедневная активность',
    'students.daily_activity_desc': 'Количество активных студентов по дням',
    'students.weekly_progress': 'Прогресс по неделям',
    'students.weekly_progress_desc': 'Средний прогресс студентов по неделям',
    'students.subject_distribution': 'Распределение по предметам',
    'students.subject_distribution_desc': 'Количество студентов по предметам',
    'students.test_results': 'Результаты тестов',
    'students.test_results_desc': 'Средние результаты тестов по предметам',
    
    // Settings
    'settings.title': 'Настройки',
    'settings.language': 'Язык интерфейса',
    'settings.language.ru': 'Русский',
    'settings.language.kz': 'Қазақша',
    'settings.contrast': 'Высокий контраст',
    'settings.darkMode': 'Тёмная тема',
    'settings.darkMode.description': 'Включить тёмную тему интерфейса',
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
    
    // Teacher dashboard
    'teacher.dashboard': 'Панель учителя',
    'teacher.manage_courses': 'Управляйте своими курсами и студентами',
    'teacher.ai_assistant': 'ИИ-ассистент',
    'teacher.ai_help': 'Используйте ИИ для помощи в обучении',
    'teacher.auto_test_check': 'Автоматическая проверка тестов',
    'teacher.auto_test_description': 'Используйте ИИ для автоматической проверки тестов и заданий студентов, экономя ваше время.',
    'teacher.generate_materials': 'Генерация учебных материалов',
    'teacher.generate_materials_description': 'Создавайте учебные материалы, задания и тесты с помощью ИИ на основе вашей программы.',
    'teacher.analyze_progress': 'Анализ успеваемости',
    'teacher.analyze_progress_description': 'Получите глубокий анализ успеваемости ваших студентов и рекомендации по улучшению обучения.',
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
    'common.save': 'Сақтау',
    'common.cancel': 'Бас тарту',
    'common.saving': 'Сақталуда...',
    
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
    
    // Lessons
    'lesson.create': 'Сабақ құру',
    'lesson.info': 'Сабақ туралы ақпарат',
    'lesson.title': 'Сабақ атауы',
    'lesson.title_placeholder': 'Мысалы: Сызықтық теңдеулерге кіріспе',
    'lesson.description': 'Қысқаша сипаттама',
    'lesson.description_placeholder': 'Сабақ мазмұнының қысқаша сипаттамасы',
    'lesson.video_url': 'Бейне URL (YouTube, Vimeo және т.б.)',
    'lesson.order': 'Реттік нөмірі',
    'lesson.content': 'Сабақ мазмұны (теориялық материал)',
    'lesson.content_placeholder': 'Теорияны, формулаларды, мысалдарды қоса алғанда, сабақтың толық мазмұны...',
    
    // Tests
    'test.create': 'Тест құру',
    'test.edit': 'Тестті өңдеу',
    'test.title': 'Тест атауы',
    'test.description': 'Тест сипаттамасы',
    'test.time_limit': 'Уақыт шектеуі (минуттар)',
    'test.passing_score': 'Өту балы (%)',
    'test.questions': 'Сұрақтар',
    'test.add_question': 'Сұрақ қосу',
    
    // Students page
    'students.title': 'Студенттер',
    'students.list': 'Барлық студенттер тізімі',
    'students.list_description': 'Студенттердің үлгерімін қарау және оларға хабарласу',
    'students.name': 'Аты',
    'students.email': 'Email',
    'students.progress': 'Үлгерім',
    'students.last_active': 'Соңғы белсенділік',
    'students.status': 'Күйі',
    'students.actions': 'Әрекеттер',
    'students.view_progress': 'Үлгерім',
    'students.send_message': 'Хабарлама',
    'students.active': 'Белсенді',
    'students.inactive': 'Белсенді емес',
    'students.daily_activity': 'Күнделікті белсенділік',
    'students.daily_activity_desc': 'Күндер бойынша белсенді студенттер саны',
    'students.weekly_progress': 'Апта бойынша үлгерім',
    'students.weekly_progress_desc': 'Студенттердің апта бойынша орташа үлгерімі',
    'students.subject_distribution': 'Пәндер бойынша бөлу',
    'students.subject_distribution_desc': 'Пәндер бойынша студенттер саны',
    'students.test_results': 'Тест нәтижелері',
    'students.test_results_desc': 'Пәндер бойынша тесттердің орташа нәтижелері',
    
    // Settings
    'settings.title': 'Параметрлер',
    'settings.language': 'Интерфейс тілі',
    'settings.language.ru': 'Орысша',
    'settings.language.kz': 'Қазақша',
    'settings.contrast': 'Жоғары контраст',
    'settings.darkMode': 'Қараңғы тақырып',
    'settings.darkMode.description': 'Қараңғы тақырыпты қосу',
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
    
    // Teacher dashboard
    'teacher.dashboard': 'Мұғалім панелі',
    'teacher.manage_courses': 'Курстарыңыз бен студенттеріңізді басқарыңыз',
    'teacher.ai_assistant': 'ИИ көмекшісі',
    'teacher.ai_help': 'Оқытуға көмектесу үшін ИИ пайдаланыңыз',
    'teacher.auto_test_check': 'Тесттерді автоматты тексеру',
    'teacher.auto_test_description': 'Уақытыңызды үнемдеу үшін студенттердің тесттері мен тапсырмаларын автоматты түрде тексеру үшін ИИ пайдаланыңыз.',
    'teacher.generate_materials': 'Оқу материалдарын жасау',
    'teacher.generate_materials_description': 'Бағдарламаңыз негізінде ИИ көмегімен оқу материалдарын, тапсырмаларды және тесттерді жасаңыз.',
    'teacher.analyze_progress': 'Үлгерімді талдау',
    'teacher.analyze_progress_description': 'Студенттеріңіздің үлгерімі туралы терең талдау және оқытуды жақсарту бойынша ұсыныстар алыңыз.',
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
