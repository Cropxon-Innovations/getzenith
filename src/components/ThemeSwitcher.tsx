import { Check, Sun, Moon, Waves, Sunset, ChevronDown } from 'lucide-react';
import { useTheme, themes, ThemeName } from '@/contexts/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const themeIcons: Record<ThemeName, React.ElementType> = {
  'theme-light': Sun,
  'theme-dark': Moon,
  'theme-enterprise': Waves,
  'theme-high-contrast': Sunset,
};

export const ThemeSwitcher = () => {
  const { theme, setTheme, currentTheme } = useTheme();
  const CurrentIcon = themeIcons[theme];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 h-9 px-3"
          aria-label="Select theme"
        >
          <div 
            className="w-4 h-4 rounded-full ring-1 ring-border"
            style={{ 
              background: `linear-gradient(135deg, ${currentTheme.preview.accent} 0%, ${currentTheme.preview.background} 100%)` 
            }}
          />
          <span className="text-foreground text-sm font-medium hidden sm:inline">
            {currentTheme.name}
          </span>
          <ChevronDown size={14} className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56 p-2">
        <div className="px-2 py-1.5 mb-1">
          <p className="text-sm font-medium text-foreground">Theme</p>
          <p className="text-xs text-muted-foreground">Choose your visual style</p>
        </div>
        
        {themes.map((t) => {
          const Icon = themeIcons[t.id];
          const isSelected = theme === t.id;
          
          return (
            <DropdownMenuItem
              key={t.id}
              onClick={() => setTheme(t.id)}
              className="flex items-center gap-3 p-2 cursor-pointer rounded-lg"
            >
              {/* Theme color preview */}
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ 
                  background: `linear-gradient(135deg, ${t.preview.accent} 0%, ${t.preview.background} 100%)`,
                  border: `1px solid ${t.preview.border}`
                }}
              >
                <Icon size={14} style={{ color: t.preview.text }} />
              </div>
              
              {/* Theme name and description */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground truncate">{t.description}</p>
              </div>
              
              {/* Selected indicator */}
              {isSelected && (
                <Check size={16} className="text-primary shrink-0" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
