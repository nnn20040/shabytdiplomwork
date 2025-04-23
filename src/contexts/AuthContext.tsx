
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
  token?: string;
}

// Интерфейс контекста аутентификации
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string, role: string) => Promise<any>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<any>;
}

// Создаем контекст с начальным значением
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  getCurrentUser: async () => {},
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
        console.log("Checking authentication...");
        const stored = localStorage.getItem('user');
        if (stored) {
          try {
            const userData = JSON.parse(stored);
            console.log("Found user in localStorage:", userData);
            
            // Проверяем наличие токена
            if (!userData.token) {
              console.warn("User found in localStorage but no token present");
              setUser(null);
              localStorage.removeItem('user');
            } else {
              setUser(userData);
              
              // Опционально: проверка валидности токена на сервере
              // const response = await authApi.getCurrentUser();
              // if (!response.success) {
              //   console.warn("Stored token is invalid");
              //   setUser(null);
              //   localStorage.removeItem('user');
              // }
            }
          } catch (error) {
            console.error("Error parsing user data from localStorage:", error);
            localStorage.removeItem('user');
          }
        } else {
          console.log("No user found in localStorage");
        }
      } catch (error) {
        console.error('Failed to get current user:', error);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Получение данных пользователя с сервера
  const getCurrentUser = async () => {
    try {
      setIsLoading(true);
      const response = await authApi.getCurrentUser();
      if (response.success && response.user) {
        // Обновляем данные в localStorage с сервера
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          const updatedUser = { 
            ...response.user,
            token: userData.token // Сохраняем токен
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);
        }
      }
      return response;
    } catch (error) {
      console.error('Get current user error:', error);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  // Функция входа в систему
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log("Login attempt with:", { email, password: "***" });
      const response = await authApi.login({ email, password });
      
      console.log("Login response:", response);
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
    } finally {
      setIsLoading(false);
    }
  };

  // Функция регистрации
  const register = async (name: string, email: string, password: string, role: string) => {
    try {
      setIsLoading(true);
      console.log("Registration attempt with:", { name, email, password: "***", role });
      const response = await authApi.register({ name, email, password, role });
      
      console.log("Registration response:", response);
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
    } finally {
      setIsLoading(false);
    }
  };

  // Функция выхода из системы
  const logout = async () => {
    try {
      setIsLoading(true);
      await authApi.logout();
      localStorage.removeItem('user');
      setUser(null);
      toast.success("Вы вышли из системы");
    } catch (error) {
      console.error('Logout failed:', error);
      // Даже в случае ошибки очищаем состояние пользователя
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setIsLoading(false);
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
    getCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
