
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { authApi } from '@/api';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Проверяем токен в localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log("No token found in localStorage");
          setIsAuthenticated(false);
          navigate('/login', { state: { from: location.pathname } });
          
          // Не показываем toast если пользователь просто перешел на страницу, требующую аутентификации
          if (!location.pathname.includes('register') && !location.pathname.includes('login')) {
            toast.error('Для доступа к этой странице необходимо войти в систему');
          }
          return;
        }
        
        try {
          // Пытаемся получить информацию о текущем пользователе
          const userData = await authApi.getCurrentUser();
          console.log("User authenticated:", userData);
          setIsAuthenticated(true);
        } catch (userError) {
          console.error("Failed to get current user:", userError);
          // Если не удалось получить пользователя, сбрасываем токен и перенаправляем на логин
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
          navigate('/login', { state: { from: location.pathname } });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        navigate('/login', { state: { from: location.pathname } });
      }
    };

    checkAuth();
  }, [navigate, location]);

  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Проверка аутентификации...</span>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default RequireAuth;
