
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/ui/Hero';
import FeatureSection from '@/components/ui/FeatureSection';
import CourseCard from '@/components/ui/CourseCard';
import TestimonialCard from '@/components/ui/TestimonialCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  // Mock data for courses
  const popularCourses = [
    {
      id: '1',
      title: 'Математика для ЕНТ: полный курс',
      description: 'Подготовка по всем разделам математики для успешной сдачи ЕНТ',
      instructor: 'Асанов Болат',
      category: 'Математика',
      rating: 4.9,
      students: 1250,
      lessons: 42,
      duration: '36 часов',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=500&auto=format&fit=crop',
      featured: true,
    },
    {
      id: '2',
      title: 'Физика: механика и термодинамика',
      description: 'Все законы физики с примерами решения задач в формате ЕНТ',
      instructor: 'Сергеева Анна',
      category: 'Физика',
      rating: 4.8,
      students: 840,
      lessons: 38,
      duration: '32 часа',
      image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=500&auto=format&fit=crop',
      featured: false,
    },
    {
      id: '3',
      title: 'История Казахстана: даты и события',
      description: 'Систематизированный курс по истории Казахстана для ЕНТ',
      instructor: 'Муратов Ерлан',
      category: 'История',
      rating: 4.7,
      students: 920,
      lessons: 35,
      duration: '30 часов',
      image: 'https://images.unsplash.com/photo-1593696954577-ab3d39317b97?q=80&w=500&auto=format&fit=crop',
      featured: true,
    },
    {
      id: '4',
      title: 'Казахский язык: грамматика и лексика',
      description: 'Интенсивный курс казахского языка для подготовки к ЕНТ',
      instructor: 'Айгуль Калиева',
      category: 'Казахский язык',
      rating: 4.6,
      students: 750,
      lessons: 40,
      duration: '35 часов',
      image: 'https://images.unsplash.com/photo-1555431189-0fabf2667795?q=80&w=500&auto=format&fit=crop',
      featured: false,
    },
  ];

  // Mock data for testimonials
  const testimonials = [
    {
      content: 'Благодаря Shabyt я смог поднять свои баллы с 80 до 125 за 3 месяца. Особенно помог ИИ-ассистент, который отвечал на все мои вопросы 24/7!',
      author: 'Алишер К.',
      role: 'Выпускник 2023',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 5,
    },
    {
      content: 'Очень удобная платформа для подготовки. Все материалы структурированы, тесты максимально приближены к формату ЕНТ. Поступила в медицинский!',
      author: 'Динара М.',
      role: 'Студентка медицинского университета',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      rating: 5,
    },
    {
      content: 'Как учитель, я ценю возможности, которые дает платформа. Создавать курсы легко, а аналитика помогает отслеживать прогресс учеников.',
      author: 'Арман Т.',
      role: 'Преподаватель физики',
      avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
      rating: 4,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        <Hero />
        
        {/* Popular Courses Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Популярные курсы
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Изучайте предметы ЕНТ с лучшими преподавателями Казахстана
                </p>
              </div>
              <Link to="/courses" className="mt-4 md:mt-0">
                <Button variant="outline" className="group">
                  Все курсы
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularCourses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          </div>
        </section>
        
        <FeatureSection />
        
        {/* Testimonials Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-secondary/30 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Что говорят наши{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                  студенты
                </span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Тысячи студентов уже успешно подготовились к ЕНТ с нашей платформой
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  {...testimonial}
                  delay={index * 150}
                />
              ))}
            </div>
            
            <div className="text-center mt-16">
              <Link to="/register">
                <Button size="lg" className="animate-hover text-base">
                  Начать бесплатно
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
