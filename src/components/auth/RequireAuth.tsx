
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

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
        // Check if user is authenticated by looking for token in localStorage
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (!token || !user) {
          console.log("No token or user found in localStorage");
          setIsAuthenticated(false);
          
          // Сохраняем текущий путь для возврата после входа
          const returnUrl = location.pathname;
          
          // Не перенаправляем пользователя, если он уже на странице входа, регистрации или главной
          if (location.pathname === '/login' || 
              location.pathname === '/register' || 
              location.pathname === '/' ||
              location.pathname === '/forgot-password' ||
              location.pathname === '/reset-password') {
            setIsAuthenticated(false);
            return;
          }
          
          // Перенаправляем на страницу входа с сохранением адреса возврата
          navigate('/login', { state: { from: returnUrl } });
          
          // Показываем уведомление только для защищенных страниц
          if (!location.pathname.includes('/register') && 
              !location.pathname.includes('/login') && 
              !location.pathname.includes('/')) {
            toast.error('Для доступа к этой странице необходимо войти в систему');
          }
          return;
        }
        
        // In a real application, you could verify the token with the server
        // For now, we just check if it exists and is not expired
        try {
          // Parse the token to check if it's expired
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(window.atob(base64));
          
          if (payload.exp && payload.exp < Date.now() / 1000) {
            console.log("Token expired, logging out");
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            sessionStorage.removeItem('isLoggedIn');
            setIsAuthenticated(false);
            navigate('/login', { state: { from: location.pathname } });
            return;
          }
        } catch (tokenError) {
          console.error("Error parsing token:", tokenError);
          // Continue anyway, we'll let the server validate the token
        }
        
        console.log("User is authenticated with token:", token.substring(0, 10) + "...");
        setIsAuthenticated(true);
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
