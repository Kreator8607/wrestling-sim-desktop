import { useState, useEffect, useCallback } from 'react';

const PROMOTION_THEMES = {
  WWE: 'wwe',
  AEW: 'aew',
  NJPW: 'njpw',
  TNA: 'tna',
  ROH: 'roh',
  CMLL: 'cmll',
  default: 'default',
};

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState('default');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('wrestling-sim-theme') || 'default';
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = useCallback((theme) => {
    const root = document.documentElement;
    
    if (theme === 'default') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }

    localStorage.setItem('wrestling-sim-theme', theme);
  }, []);

  const switchTheme = useCallback((promotionName) => {
    const theme = PROMOTION_THEMES[promotionName] || 'default';
    setCurrentTheme(theme);
    applyTheme(theme);
  }, [applyTheme]);

  const switchThemeByCode = useCallback((themeCode) => {
    if (Object.values(PROMOTION_THEMES).includes(themeCode)) {
      setCurrentTheme(themeCode);
      applyTheme(themeCode);
    }
  }, [applyTheme]);

  return {
    currentTheme,
    switchTheme,
    switchThemeByCode,
    availableThemes: Object.keys(PROMOTION_THEMES),
  };
}

// Theme context for global access
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const theme = useTheme();

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return context;
}
