
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (!isLoading && !user && !redirected) {
      console.log("No authenticated user found, redirecting to login");
      setRedirected(true);
      navigate('/login', { state: { from: location.pathname } });
      
      // Don't show the toast if coming from the registration or login page
      if (!location.pathname.includes('register') && !location.pathname.includes('login')) {
        toast.error('Для доступа к этой странице необходимо войти в систему');
      }
    }
  }, [user, isLoading, navigate, location, redirected]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Проверка аутентификации...</span>
      </div>
    );
  }

  return user ? <>{children}</> : null;
};

export default RequireAuth;
