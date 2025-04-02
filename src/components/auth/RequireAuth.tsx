
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
        // Check if user is authenticated by looking for token in localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log("No token found in localStorage");
          setIsAuthenticated(false);
          navigate('/login', { state: { from: location.pathname } });
          // Don't show the toast if coming from the registration or login page
          if (!location.pathname.includes('register') && !location.pathname.includes('login')) {
            toast.error('Для доступа к этой странице необходимо войти в систему');
          }
          return;
        }
        
        try {
          // Try to get current user to verify token
          console.log("Verifying token with backend");
          await authApi.getCurrentUser();
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Token validation failed:", error);
          // If token is invalid, remove it
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
          navigate('/login', { state: { from: location.pathname } });
          toast.error('Сессия истекла. Пожалуйста, войдите снова.');
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
