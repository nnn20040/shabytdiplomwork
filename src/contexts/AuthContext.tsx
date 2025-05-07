
import React, { createContext, useContext, useState, useEffect } from 'react';
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
  register: (firstName: string, lastName: string, email: string, password: string, role: string) => Promise<any>;
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
            
            // Проверяем наличие данных
            if (!userData.name || !userData.role) {
              console.warn("User found in localStorage but data is incomplete");
              setUser(null);
              localStorage.removeItem('user');
            } else {
              setUser(userData);
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

  // Получение данных пользователя с сервера (в демо-режиме просто возвращает данные из localStorage)
  const getCurrentUser = async () => {
    try {
      setIsLoading(true);
      const stored = localStorage.getItem('user');
      if (stored) {
        const userData = JSON.parse(stored);
        return { success: true, user: userData };
      }
      return { success: false };
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
      
      // Демо-режим: всегда успешный вход
      // Определяем роль на основе email (для демо)
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
  const register = async (firstName: string, lastName: string, email: string, password: string, role: string) => {
    try {
      setIsLoading(true);
      console.log("Registration attempt with:", { firstName, lastName, email, password: "***", role });
      
      // Демо-режим: всегда успешная регистрация
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
        message: "Регистрация успешна"
      };
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
      localStorage.removeItem('user');
      setUser(null);
      toast.success("Вы вышли из системы");
    } catch (error) {
      console.error('Logout failed:', error);
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
