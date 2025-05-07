
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect authenticated users
    if (isAuthenticated && user) {
      if (user.role === 'teacher') {
        navigate('/teacher-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Don't render form for authenticated users
  if (isAuthenticated) {
    return null; // Return nothing, the useEffect will redirect
  }

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
                Войдите в свой аккаунт
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-lg">
                Продолжите подготовку к ЕНТ с персонализированными курсами и помощью ИИ-ассистента
              </p>
              
              <div className="bg-secondary/50 border border-border/50 rounded-lg p-6">
                <h3 className="font-medium mb-2">Ещё нет аккаунта?</h3>
                <p className="text-muted-foreground mb-4">
                  Зарегистрируйтесь бесплатно и получите доступ ко всем курсам и материалам для подготовки к ЕНТ
                </p>
                <Link to="/register" className="text-primary hover:underline font-medium">
                  Создать аккаунт →
                </Link>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-border/50">
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
