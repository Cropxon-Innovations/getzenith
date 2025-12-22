import { StudioSidebar } from '@/components/studio/StudioSidebar';
import { StudioHeader } from '@/components/studio/StudioHeader';
import { StudioContent } from '@/components/studio/StudioContent';
import { SEO } from '@/components/SEO';

const Studio = () => {
  return (
    <>
      <SEO 
        title="Studio | Zenith" 
        description="Manage your content, experiences, and automations in Zenith Studio."
      />
      <div className="flex h-screen w-full bg-background">
        <StudioSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <StudioHeader />
          <StudioContent />
        </div>
      </div>
    </>
  );
};

export default Studio;
