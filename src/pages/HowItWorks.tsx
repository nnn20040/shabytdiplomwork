
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Laptop, BookOpen, Users, Award, CheckCircle, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Laptop className="h-12 w-12 text-primary" />,
      title: 'Регистрация на платформе',
      description: 'Создайте учетную запись, чтобы получить доступ ко всем курсам и функциям платформы'
    },
    {
      icon: <BookOpen className="h-12 w-12 text-primary" />,
      title: 'Выбор предметов',
      description: 'Выберите интересующие вас предметы ЕНТ и начните обучение с помощью видеоуроков'
    },
    {
      icon: <Users className="h-12 w-12 text-primary" />,
      title: 'Выполнение заданий',
      description: 'Закрепите знания с помощью практических заданий и тестов в формате ЕНТ'
    },
    {
      icon: <Award className="h-12 w-12 text-primary" />,
      title: 'Отслеживание прогресса',
      description: 'Анализируйте свой прогресс и концентрируйтесь на слабых местах для достижения лучших результатов'
    }
  ];

  const benefits = [
    'Адаптивное обучение под ваш темп и уровень знаний',
    'Постоянный доступ к курсам 24/7',
    'Тесты в формате ЕНТ с детальным разбором ошибок',
    'Персональные рекомендации от ИИ-ассистента',
    'Помощь преподавателей и общение с другими учениками',
    'Статистика успеваемости и отслеживание прогресса'
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        {/* Hero section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-secondary/30 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Как работает наша платформа
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Эффективная методика для подготовки к ЕНТ с использованием современных технологий и искусственного интеллекта
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/courses">
                  <Button size="lg" className="animate-hover">
                    Начать обучение
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="lg" className="animate-hover">
                    Зарегистрироваться
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Steps section */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Четыре простых шага к успешной сдаче ЕНТ
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="bg-card border border-border/50 rounded-xl p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Benefits section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
              <div className="lg:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Преимущества обучения на нашей платформе
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Мы создали платформу, которая сочетает в себе лучшие методики подготовки к ЕНТ и современные технологии
                </p>
                
                <div className="space-y-4 mb-8">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mr-3" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
                
                <Link to="/register">
                  <Button className="group">
                    Создать аккаунт
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              
              <div className="lg:w-1/2">
                <div className="aspect-video bg-muted rounded-xl overflow-hidden shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
                    alt="Ученики в процессе обучения"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA section */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Готовы начать подготовку к ЕНТ?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Присоединяйтесь к тысячам студентов, которые уже улучшили свои результаты на ЕНТ с нашей платформой
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/register">
                  <Button size="lg" className="animate-hover">
                    Зарегистрироваться бесплатно
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

export default HowItWorks;
