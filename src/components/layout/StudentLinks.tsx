
import { NavLink } from 'react-router-dom';
import { BookOpen, LayoutDashboard, MessageSquare, GraduationCap, FileText } from 'lucide-react';

const StudentLinks = () => {
  return (
    <div className="flex flex-col space-y-1">
      <NavLink 
        to="/dashboard" 
        className={({ isActive }) => 
          `flex items-center px-3 py-2 text-sm rounded-md ${
            isActive 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-muted'
          }`
        }
      >
        <LayoutDashboard className="mr-2 h-4 w-4" />
        <span>Дашборд</span>
      </NavLink>
      
      <NavLink 
        to="/courses" 
        className={({ isActive }) => 
          `flex items-center px-3 py-2 text-sm rounded-md ${
            isActive 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-muted'
          }`
        }
      >
        <BookOpen className="mr-2 h-4 w-4" />
        <span>Курсы</span>
      </NavLink>
      
      <NavLink 
        to="/tests" 
        className={({ isActive }) => 
          `flex items-center px-3 py-2 text-sm rounded-md ${
            isActive 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-muted'
          }`
        }
      >
        <FileText className="mr-2 h-4 w-4" />
        <span>Тесты</span>
      </NavLink>
      
      <NavLink 
        to="/forum" 
        className={({ isActive }) => 
          `flex items-center px-3 py-2 text-sm rounded-md ${
            isActive 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-muted'
          }`
        }
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        <span>Форум</span>
      </NavLink>
      
      <NavLink 
        to="/student/progress" 
        className={({ isActive }) => 
          `flex items-center px-3 py-2 text-sm rounded-md ${
            isActive 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-muted'
          }`
        }
      >
        <GraduationCap className="mr-2 h-4 w-4" />
        <span>Мой прогресс</span>
      </NavLink>
    </div>
  );
};

export default StudentLinks;
