import { useState } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { StudioSidebar } from '@/components/studio/StudioSidebar';
import { StudioHeader } from '@/components/studio/StudioHeader';
import { StudioContent } from '@/components/studio/StudioContent';
import { StudioMobileDrawer } from '@/components/studio/StudioMobileDrawer';
import { SEO } from '@/components/SEO';

const Studio = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <ThemeProvider>
      <SEO 
        title="Studio | Zenith" 
        description="Manage your content, experiences, and automations in Zenith Studio."
      />
      <div className="flex h-dvh w-full bg-background">
        {/* Desktop Sidebar - hidden on mobile */}
        <div className="hidden md:block">
          <StudioSidebar />
        </div>
        
        {/* Mobile Drawer */}
        <StudioMobileDrawer 
          open={mobileDrawerOpen} 
          onOpenChange={setMobileDrawerOpen} 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <StudioHeader onMenuClick={() => setMobileDrawerOpen(true)} />
          <StudioContent />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Studio;
