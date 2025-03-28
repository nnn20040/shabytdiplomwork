
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTheme as useNextTheme } from 'next-themes';

type ThemeContextType = {
  darkMode: boolean;
  highContrast: boolean;
  toggleDarkMode: () => void;
  toggleHighContrast: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme, setTheme } = useNextTheme();
  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  // Initialize from localStorage or system preferences
  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode');
    const storedHighContrast = localStorage.getItem('highContrast');
    
    if (storedDarkMode) {
      setDarkMode(storedDarkMode === 'true');
    }
    
    if (storedHighContrast) {
      setHighContrast(storedHighContrast === 'true');
    }
  }, []);

  // Sync theme with darkMode state
  useEffect(() => {
    setTheme(darkMode ? 'dark' : 'light');
  }, [darkMode, setTheme]);

  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem('darkMode', String(newValue));
  };

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    localStorage.setItem('highContrast', String(newValue));
  };

  const value = {
    darkMode,
    highContrast,
    toggleDarkMode,
    toggleHighContrast,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
