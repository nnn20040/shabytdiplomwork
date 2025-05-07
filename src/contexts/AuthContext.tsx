
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// User type
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  token?: string;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (firstName: string, lastName: string, email: string, password: string, role: string) => Promise<any>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<any>;
}

// Create context with initial value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false, // Changed to false to avoid loading state
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  getCurrentUser: async () => {},
});

// Auth context hook
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Create a default demo user to avoid loading state
  const defaultUser = {
    id: `demo-${Date.now()}`,
    name: 'Демо Пользователь',
    email: 'demo@example.com',
    role: 'student',
    token: `demo_token_${Date.now()}`
  };

  const [user, setUser] = useState<User | null>(defaultUser);
  const [isLoading, setIsLoading] = useState(false); // Start without loading

  // Check auth on load - simplified to avoid delays
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(defaultUser);
        localStorage.setItem('user', JSON.stringify(defaultUser));
      }
    } else {
      // Set default user when none exists
      setUser(defaultUser);
      localStorage.setItem('user', JSON.stringify(defaultUser));
    }
  }, []);

  // Get current user - simplified
  const getCurrentUser = async () => {
    return { success: true, user: user || defaultUser };
  };

  // Login function - simplified, always successful
  const login = async (email: string, password: string) => {
    const role = email.includes('teacher') ? 'teacher' : 'student';
    const name = email.includes('teacher') ? 'Преподаватель Демо' : 'Студент Демо';
    
    const userData = {
      id: `demo-${Date.now()}`,
      name: name,
      email: email,
      role: role,
      token: `demo_token_${Date.now()}`
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    toast.success("Успешный вход в систему!");
    
    return { 
      success: true,
      user: userData,
      message: "Вход выполнен успешно"
    };
  };

  // Register function - simplified, always successful
  const register = async (firstName: string, lastName: string, email: string, password: string, role: string) => {
    const userData = {
      id: `demo-${Date.now()}`,
      name: `${firstName} ${lastName}`,
      email: email,
      firstName: firstName,
      lastName: lastName,
      role: role,
      token: `demo_token_${Date.now()}`
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    toast.success("Регистрация успешна!");
    
    return { 
      success: true,
      user: userData,
      data: {
        message: "Регистрация успешна"
      }
    };
  };

  // Logout function
  const logout = async () => {
    localStorage.removeItem('user');
    setUser(defaultUser); // Set back to default user instead of null
    toast.success("Вы вышли из системы");
  };

  // Context value
  const value = {
    user,
    isAuthenticated: true, // Always authenticated
    isLoading,
    login,
    register,
    logout,
    getCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
