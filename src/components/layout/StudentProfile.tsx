
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserIcon, Settings, LogOut, Graduation, Bell } from 'lucide-react';
import { toast } from 'sonner';

interface StudentProfileProps {
  onLogout: () => void;
}

const StudentProfile = ({ onLogout }: StudentProfileProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  
  useEffect(() => {
    // Check if user exists in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    // Clear user from localStorage
    localStorage.removeItem('user');
    sessionStorage.removeItem('isLoggedIn');
    
    // Call onLogout prop
    onLogout();
    
    // Notify user
    toast.success('Вы успешно вышли из системы');
    
    // Navigate to home
    navigate('/');
  };

  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getDashboardLink = () => {
    if (user.role === 'student') {
      return '/student-dashboard';
    } else if (user.role === 'teacher') {
      return '/teacher-dashboard';
    }
    return '/dashboard';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarImage alt={user.name} src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary">
            <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-75"></span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-base font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {user.role === 'student' ? 'Студент' : 'Преподаватель'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={getDashboardLink()} className="cursor-pointer">
            <Graduation className="mr-2 h-4 w-4" />
            <span>Моя учебная панель</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/notifications" className="cursor-pointer">
            <Bell className="mr-2 h-4 w-4" />
            <span>Уведомления</span>
            <span className="ml-auto bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">3</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Мой профиль</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Настройки</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Выйти</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StudentProfile;
