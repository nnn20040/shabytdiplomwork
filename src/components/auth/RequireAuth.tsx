
import { useEffect } from 'react';
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

  useEffect(() => {
    // DEMO MODE: If no user in localStorage but we're in demo mode,
    // automatically create a demo user
    if (!isLoading && !user) {
      console.log("DEMO MODE: No authenticated user found, creating demo user");
      
      // Create a demo user based on requested route
      const isTeacherRoute = location.pathname.includes('teacher');
      
      const demoUser = {
        id: `demo_${Date.now()}`,
        name: isTeacherRoute ? 'Демо Учитель' : 'Демо Студент',
        email: isTeacherRoute ? 'teacher@example.com' : 'student@example.com',
        role: isTeacherRoute ? 'teacher' : 'student',
        token: `demo_token_${Date.now()}`
      };
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(demoUser));
      
      // Force page reload to recognize the new user
      window.location.reload();
    }
  }, [user, isLoading, navigate, location]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Проверка аутентификации...</span>
      </div>
    );
  }

  return <>{children}</>;
};

export default RequireAuth;
