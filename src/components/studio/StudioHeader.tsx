import { useParams } from 'react-router-dom';
import { Bell, Search, User, Settings, HelpCircle, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '../ThemeSwitcher';

const studioTitles: Record<string, string> = {
  cms: 'CMS Studio',
  canvas: 'Canvas Studio',
  website: 'Website Studio',
  lms: 'LMS Studio',
  automation: 'Automation Studio',
};

interface StudioHeaderProps {
  onMenuClick?: () => void;
}

export const StudioHeader = ({ onMenuClick }: StudioHeaderProps) => {
  const { studioType = 'cms' } = useParams();
  const title = studioTitles[studioType] || 'Studio';

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 md:px-6">
      {/* Left: Mobile Menu + Title */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </Button>
        
        <h1 className="text-lg font-semibold">{title}</h1>
        <span className="text-muted-foreground hidden sm:inline">/</span>
        <span className="text-sm text-muted-foreground hidden sm:inline">Overview</span>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-secondary/50 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground bg-background px-1.5 py-0.5 rounded border border-border">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 md:gap-2">
        <ThemeSwitcher />
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
        </Button>
        
        <Button variant="ghost" size="icon" className="hidden sm:flex">
          <HelpCircle size={20} />
        </Button>
        
        <Button variant="ghost" size="icon" className="hidden sm:flex">
          <Settings size={20} />
        </Button>
        
        <div className="w-px h-8 bg-border mx-1 md:mx-2 hidden sm:block" />
        
        <Button variant="ghost" size="sm" className="gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <User size={16} className="text-primary" />
          </div>
          <span className="hidden lg:inline text-sm">Account</span>
        </Button>
      </div>
    </header>
  );
};
