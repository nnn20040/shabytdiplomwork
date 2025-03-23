
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RegisterForm from '@/components/auth/RegisterForm';
import { CheckCircle } from 'lucide-react';

const Register = () => {
  const benefits = [
    'Доступ ко всем курсам и материалам',
    'Персонализированный план обучения',
    'Проверка знаний через тесты',
    'Помощь ИИ-ассистента 24/7',
    'Аналитика прогресса и рекомендации',
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12">
              <Link to="/" className="inline-block text-primary mb-8">
                ← Вернуться на главную
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Создайте аккаунт
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-lg">
                Присоединяйтесь к тысячам студентов, которые уже улучшили свои результаты на ЕНТ с нашей платформой
              </p>
              
              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mr-3" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="bg-secondary/50 border border-border/50 rounded-lg p-6">
                <h3 className="font-medium mb-2">Уже есть аккаунт?</h3>
                <p className="text-muted-foreground mb-4">
                  Войдите в свой аккаунт, чтобы продолжить обучение
                </p>
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Войти в аккаунт →
                </Link>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-border/50">
                <RegisterForm />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
