import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeName = 
  | 'theme-dark-pro'
  | 'theme-light-minimal'
  | 'theme-enterprise-blue'
  | 'theme-neon-tech'
  | 'theme-calm-neutral'
  | 'theme-executive-grey'
  | 'theme-high-contrast'
  | 'theme-custom-brand';

export const themes: { id: ThemeName; name: string; description: string }[] = [
  { id: 'theme-dark-pro', name: 'Dark Pro', description: 'Professional dark theme' },
  { id: 'theme-light-minimal', name: 'Light Minimal', description: 'Clean and minimal' },
  { id: 'theme-enterprise-blue', name: 'Enterprise Blue', description: 'Corporate trust' },
  { id: 'theme-neon-tech', name: 'Neon Tech', description: 'Futuristic vibes' },
  { id: 'theme-calm-neutral', name: 'Calm Neutral', description: 'Warm and welcoming' },
  { id: 'theme-executive-grey', name: 'Executive Grey', description: 'Sophisticated monochrome' },
  { id: 'theme-high-contrast', name: 'High Contrast', description: 'Maximum accessibility' },
  { id: 'theme-custom-brand', name: 'Custom Brand', description: 'Bold purple accent' },
];

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeName>('theme-dark-pro');

  useEffect(() => {
    const savedTheme = localStorage.getItem('zenith-theme') as ThemeName;
    if (savedTheme && themes.find(t => t.id === savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('zenith-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
