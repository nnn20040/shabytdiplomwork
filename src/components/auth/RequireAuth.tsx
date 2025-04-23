
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { user, isLoading, getCurrentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [redirected, setRedirected] = useState(false);
  const [authCheckTimeout, setAuthCheckTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear existing timeout if component unmounts or effect runs again
    if (authCheckTimeout) {
      clearTimeout(authCheckTimeout);
    }

    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.log("Authentication check timed out");
      if (isLoading) {
        // If still loading after timeout, consider it a failure and redirect
        setRedirected(true);
        navigate('/login', { state: { from: location.pathname } });
        toast.error('Не удалось проверить аутентификацию. Пожалуйста, войдите снова.');
      }
    }, 5000); // 5 seconds timeout

    setAuthCheckTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isLoading, navigate, location.pathname]);

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
