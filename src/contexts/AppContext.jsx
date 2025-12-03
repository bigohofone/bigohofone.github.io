import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [locale, setLocale] = useState('en');
  const [darkMode, setDarkMode] = useState(false);

  const toggleLocale = () => setLocale((prev) => (prev === 'ko' ? 'en' : 'ko'));
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <AppContext.Provider value={{ locale, setLocale, toggleLocale, darkMode, setDarkMode, toggleDarkMode }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}