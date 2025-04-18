import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '@/api';
import { toast } from 'sonner';

// Тип пользователя
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

// Интерфейс контекста аутентификации
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string, role: string) => Promise<any>;
  logout: () => Promise<void>;
}

// Создаем контекст с начальным значением
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

// Хук для использования контекста аутентификации
export const useAuth = () => useContext(AuthContext);

// Провайдер контекста аутентификации
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Проверка аутентификации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const stored = localStorage.getItem('user');
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Failed to get current user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Функция входа в систему
  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      if (response && response.user) {
        setUser(response.user);
        toast.success("Успешный вход в систему!");
      }
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error instanceof Error ? error.message : "Ошибка входа в систему";
      toast.error(errorMessage);
      throw error;
    }
  };

  // Функция регистрации
  const register = async (name: string, email: string, password: string, role: string) => {
    try {
      const response = await authApi.register({ name, email, password, role });
      if (response && response.user) {
        setUser(response.user);
        toast.success("Регистрация успешна!");
      }
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      const errorMessage = error instanceof Error ? error.message : "Ошибка при регистрации";
      toast.error(errorMessage);
      throw error;
    }
  };

  // Функция выхода из системы
  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      toast.success("Вы вышли из системы");
    } catch (error) {
      console.error('Logout failed:', error);
      // Даже в случае ошибки очищаем состояние пользователя
      setUser(null);
    }
  };

  // Значение контекста
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
