import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeName = 
  | 'theme-light-minimal'
  | 'theme-dark-pro'
  | 'theme-enterprise-blue'
  | 'theme-calm-neutral'
  | 'theme-executive-grey'
  | 'theme-high-contrast'
  | 'theme-custom-brand';

export interface ThemeDefinition {
  id: ThemeName;
  name: string;
  description: string;
  category: 'light' | 'dark' | 'brand';
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
    id: 'theme-light-minimal',
    name: 'Light Minimal',
    description: 'Clean, airy, modern — ideal for startups and content-heavy businesses',
    category: 'light',
    preview: {
      background: '#FAFAFA',
      sidebar: '#F5F5F5',
      card: '#FFFFFF',
      accent: '#3B82F6',
      text: '#1A1A1A',
      muted: '#A3A3A3',
      border: '#E5E5E5',
    },
  },
  {
    id: 'theme-dark-pro',
    name: 'Dark Pro',
    description: 'Professional, focused — perfect for SaaS, dev tools, and enterprises',
    category: 'dark',
    preview: {
      background: '#0A0A0B',
      sidebar: '#111113',
      card: '#18181B',
      accent: '#8B5CF6',
      text: '#FAFAFA',
      muted: '#71717A',
      border: '#27272A',
    },
  },
  {
    id: 'theme-enterprise-blue',
    name: 'Enterprise Blue',
    description: 'Corporate trust & scale — for regulated industries and large organizations',
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
    id: 'theme-calm-neutral',
    name: 'Calm Neutral',
    description: 'Warm, human, welcoming — for education, communities, and internal teams',
    category: 'light',
    preview: {
      background: '#FAF9F7',
      sidebar: '#F5F3F0',
      card: '#FFFFFF',
      accent: '#78716C',
      text: '#1C1917',
      muted: '#A8A29E',
      border: '#E7E5E4',
    },
  },
  {
    id: 'theme-executive-grey',
    name: 'Executive Grey',
    description: 'Sophisticated & understated — for leadership portals and analytics views',
    category: 'dark',
    preview: {
      background: '#18181B',
      sidebar: '#1F1F23',
      card: '#27272A',
      accent: '#A1A1AA',
      text: '#FAFAFA',
      muted: '#52525B',
      border: '#3F3F46',
    },
  },
  {
    id: 'theme-high-contrast',
    name: 'High Contrast',
    description: 'Maximum readability — WCAG-compliant for accessibility-first environments',
    category: 'light',
    preview: {
      background: '#FFFFFF',
      sidebar: '#F0F0F0',
      card: '#FFFFFF',
      accent: '#000000',
      text: '#000000',
      muted: '#525252',
      border: '#000000',
    },
  },
  {
    id: 'theme-custom-brand',
    name: 'Custom Brand',
    description: 'Your brand identity — derived from your logo and brand guidelines',
    category: 'brand',
    preview: {
      background: '#0D0D12',
      sidebar: '#13131A',
      card: '#1A1A24',
      accent: '#A855F7',
      text: '#F5F5F5',
      muted: '#6B6B80',
      border: '#2A2A3C',
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
  const [theme, setTheme] = useState<ThemeName>('theme-dark-pro');

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