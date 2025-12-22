import { useState } from 'react';
import { motion } from 'framer-motion';
import { CMSLeftSidebar } from './CMSLeftSidebar';
import { CMSEditorCanvas } from './CMSEditorCanvas';
import { CMSRightPanel } from './CMSRightPanel';

type PreviewDevice = 'mobile' | 'tablet' | 'desktop';

export const CMSStudio = () => {
  const [selectedContentId, setSelectedContentId] = useState<string | null>('1');
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop');

  const handleNewContent = () => {
    // In a real app, this would create a new content item
    console.log('Creating new content');
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      {/* Left Sidebar - Content Library */}
      <CMSLeftSidebar
        selectedContentId={selectedContentId}
        onSelectContent={setSelectedContentId}
        onNewContent={handleNewContent}
      />

      {/* Center - Editor Canvas */}
      <CMSEditorCanvas
        contentId={selectedContentId}
        onDataChange={(data) => {
          // Handle autosave
          console.log('Content changed:', data);
        }}
      />

      {/* Right Panel - Metadata & Settings */}
      <CMSRightPanel
        contentId={selectedContentId}
        previewDevice={previewDevice}
        onPreviewDeviceChange={setPreviewDevice}
      />
    </div>
  );
};