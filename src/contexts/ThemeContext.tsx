import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeName = 
  | 'theme-light'
  | 'theme-dark'
  | 'theme-enterprise'
  | 'theme-high-contrast';

export interface ThemeDefinition {
  id: ThemeName;
  name: string;
  description: string;
  category: 'light' | 'dark';
  preview: {
    background: string;
    sidebar: string;
    card: string;
    accent: string;
    text: string;
    muted: string;
    border: string;
  };
}

export const themes: ThemeDefinition[] = [
  {
    id: 'theme-light',
    name: 'Light',
    description: 'Clean and bright',
    category: 'light',
    preview: {
      background: '#FAFAFA',
      sidebar: '#FFFFFF',
      card: '#FFFFFF',
      accent: '#3B82F6',
      text: '#1A1A2E',
      muted: '#6B7280',
      border: '#E5E7EB',
    },
  },
  {
    id: 'theme-dark',
    name: 'Dark',
    description: 'Modern and elegant',
    category: 'dark',
    preview: {
      background: '#0A0A0F',
      sidebar: '#0F0F14',
      card: '#0F0F14',
      accent: '#3B82F6',
      text: '#FAFAFA',
      muted: '#71717A',
      border: '#27272A',
    },
  },
  {
    id: 'theme-enterprise',
    name: 'Ocean',
    description: 'Deep and professional',
    category: 'dark',
    preview: {
      background: '#0C1929',
      sidebar: '#111D2E',
      card: '#111D2E',
      accent: '#0EA5E9',
      text: '#F1F5F9',
      muted: '#64748B',
      border: '#1E3A5F',
    },
  },
  {
    id: 'theme-high-contrast',
    name: 'Sunset',
    description: 'Warm and energetic',
    category: 'dark',
    preview: {
      background: '#0F0908',
      sidebar: '#171210',
      card: '#171210',
      accent: '#F97316',
      text: '#FEF9F3',
      muted: '#A18072',
      border: '#2D2420',
    },
  },
];

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  currentTheme: ThemeDefinition;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeName>('theme-dark');

  const currentTheme = themes.find(t => t.id === theme) || themes[1];

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
    <ThemeContext.Provider value={{ theme, setTheme, currentTheme }}>
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
