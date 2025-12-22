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
    description: 'Clean, modern, and professional',
    category: 'light',
    preview: {
      background: '#FAFAFA',
      sidebar: '#F5F5F5',
      card: '#FFFFFF',
      accent: '#2563EB',
      text: '#171717',
      muted: '#737373',
      border: '#E5E5E5',
    },
  },
  {
    id: 'theme-dark',
    name: 'Dark',
    description: 'Focused, modern, and elegant',
    category: 'dark',
    preview: {
      background: '#0A0A0B',
      sidebar: '#111113',
      card: '#18181B',
      accent: '#3B82F6',
      text: '#FAFAFA',
      muted: '#71717A',
      border: '#27272A',
    },
  },
  {
    id: 'theme-enterprise',
    name: 'Enterprise',
    description: 'Corporate trust and scale',
    category: 'dark',
    preview: {
      background: '#0F172A',
      sidebar: '#1E293B',
      card: '#1E293B',
      accent: '#3B82F6',
      text: '#F1F5F9',
      muted: '#64748B',
      border: '#334155',
    },
  },
  {
    id: 'theme-high-contrast',
    name: 'High Contrast',
    description: 'Maximum accessibility and readability',
    category: 'light',
    preview: {
      background: '#FFFFFF',
      sidebar: '#F5F5F5',
      card: '#FFFFFF',
      accent: '#1D4ED8',
      text: '#000000',
      muted: '#525252',
      border: '#171717',
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
