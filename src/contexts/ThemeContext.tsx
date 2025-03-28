
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTheme as useNextTheme } from 'next-themes';

interface ThemeContextType {
  highContrast: boolean;
  toggleHighContrast: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, setTheme } = useNextTheme();
  
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('highContrast') === 'true';
    }
    return false;
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || theme === 'dark';
    }
    return false;
  });

  // Sync with next-themes when theme changes
  useEffect(() => {
    if (theme === 'dark' && !darkMode) {
      setDarkMode(true);
    } else if (theme === 'light' && darkMode) {
      setDarkMode(false);
    }
  }, [theme, darkMode]);

  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    setTheme(newDarkMode ? 'dark' : 'light');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('highContrast', String(highContrast));
      
      if (highContrast) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
    }
  }, [highContrast]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', String(darkMode));
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ highContrast, toggleHighContrast, darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
