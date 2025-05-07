import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, School, Book, Brain, Star } from 'lucide-react';

const About = () => {
  const team = [
    {
      name: 'Адилбек Нурлыбек',
      role: 'Основатель, CEO',
      bio: 'Аналитик с большим опытом работы и будущий выпускник Сулейман Демиреля, Разработчик',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=500&auto=format&fit=crop',
    },
    {
      name: 'Мауленов Бакдаулет',
      role: 'Руководитель образовательных программ',
      bio: 'Бэкенд разработчик, методик подготовка к ЕНТ',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=500&auto=format&fit=crop',
    },
    {
      name: 'Нурбек Доссанов',
      role: 'Технический директор',
      bio: 'Эксперт в области образовательных технологий и искусственного интеллекта',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=500&auto=format&fit=crop',
    },
    {
      name: 'Батыйхан Исмамутов',
      role: 'Методист по математике',
      bio: 'Имеет опыта в преподавание, Разработчик',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=500&auto=format&fit=crop',
    },
    {
      name: 'Даниял Турысбек',
      role: 'Главный разработчик',
      bio: 'Специалист по образовательным технологиям, разработчик платформы',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=500&auto=format&fit=crop',
    },
  ];

  const stats = [
    { 
      icon: <School className="h-10 w-10 text-primary" />, 
      value: '10,000+', 
      label: 'Студентов' 
    },
    { 
      icon: <Book className="h-10 w-10 text-primary" />, 
      value: '50+', 
      label: 'Курсов' 
    },
    { 
      icon: <Brain className="h-10 w-10 text-primary" />, 
      value: '30+', 
      label: 'Преподавателей' 
    },
    { 
      icon: <Star className="h-10 w-10 text-primary" />, 
      value: '95%', 
      label: 'Успешных студентов' 
    },
  ];

  // Обновленные ссылки на курсы YouTube
  const courseLinks = {
    math: 'https://www.youtube.com/watch?v=pJpBYlvB2a8&list=PLGfOjbqAzLPF80bQsPslH0-90uPLtg2lJ&index=2',
    physics: 'https://www.youtube.com/watch?v=VWGkC0clMNA&list=PLdjp7wVqN3Wvjuf8JbuKPnwUewOOZUsZD',
    chemistry: 'https://www.youtube.com/watch?v=1Em3NWr8Y_s&list=PLoe4L7cYJo_Wh9JJUn1JbTwwmiYeV8P0R',
    history: 'https://www.youtube.com/watch?v=RzOJNLuyx7M',
    kazakh: 'https://www.youtube.com/watch?v=5t76qMokdyA&list=PLtcU2pef2q99tZ9JuWPSk-N3bz7Ik7P2W',
    english: 'https://www.youtube.com/watch?v=fsOBilnCJIA&list=PLh35lj1wGT3E5HXA5dcatk7-GEi4IASCs',
  };

  // Сохраняем ссылки в localStorage для доступа из других компонентов
  React.useEffect(() => {
    localStorage.setItem('courseLinks', JSON.stringify(courseLinks));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        {/* Hero section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-secondary/30 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center gap-12">
              <div className="lg:w-1/2">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  О нашей платформе
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  StudyHub — современная образовательная платформа, созданная для помощи казахстанским школьникам в подготовке к Единому Национальному Тестированию (ЕНТ)
                </p>
                <Link to="/courses">
                  <Button size="lg" className="animate-hover">
                    Начать обучение
                  </Button>
                </Link>
              </div>
              
              <div className="lg:w-1/2">
                <div className="aspect-video bg-muted rounded-xl overflow-hidden shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop"
                    alt="Наша миссия"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our mission section */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Наша миссия</h2>
              <p className="text-xl text-muted-foreground mb-12">
                Мы стремимся сделать качественное образование доступным для каждого школьника в Казахстане, независимо от его местоположения или финансовых возможностей.
              </p>
              
              <Separator className="mb-12" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-4">
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold mb-2">{stat.value}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Our team section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Наша команда</h2>
              <p className="text-xl text-muted-foreground">
                Команда профессионалов, объединенных одной целью — помочь каждому школьнику достичь максимальных результатов на ЕНТ
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
              {team.map((member, index) => (
                <div key={index} className="bg-card border border-border/50 rounded-xl overflow-hidden">
                  <div className="aspect-square">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-primary text-sm mb-4">{member.role}</p>
                    <p className="text-muted-foreground">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Our approach section */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
              <div className="lg:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Наш подход к обучению
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Мы сочетаем традиционные методики с современными технологиями, чтобы сделать процесс обучения максимально эффективным:
                </p>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <div className="bg-primary/10 rounded-full p-1 mr-3 mt-1">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                    <p>Персонализированный подход к каждому ученику</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary/10 rounded-full p-1 mr-3 mt-1">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                    <p>Интерактивные уроки с высококачественными видеоматериалами</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary/10 rounded-full p-1 mr-3 mt-1">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                    <p>Практические задания и тесты в формате ЕНТ</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary/10 rounded-full p-1 mr-3 mt-1">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                    <p>Использование искусственного интеллекта для адаптации обучения</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary/10 rounded-full p-1 mr-3 mt-1">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                    <p>Постоянная обратная связь и поддержка от преподавателей</p>
                  </li>
                </ul>
                
                <Link to="/how-it-works">
                  <Button className="group">
                    Подробнее о методике
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              
              <div className="lg:w-1/2">
                <div className="aspect-video bg-muted rounded-xl overflow-hidden shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1581078426770-6d336e5de7bf?q=80&w=1470&auto=format&fit=crop"
                    alt="Наш подход к обучению"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-secondary/30 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Присоединяйтесь к нам
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Начните подготовку к ЕНТ прямо сейчас и получите доступ ко всем нашим курсам и материалам
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/register">
                  <Button size="lg" className="animate-hover">
                    Создать аккаунт
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button variant="outline" size="lg" className="animate-hover">
                    Посмотреть курсы
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
