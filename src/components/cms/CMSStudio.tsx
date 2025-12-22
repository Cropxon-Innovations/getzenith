import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CMSLeftSidebar } from './CMSLeftSidebar';
import { CMSEditorCanvas } from './CMSEditorCanvas';
import { CMSRightPanel } from './CMSRightPanel';
import { CMSBlockPickerPanel } from './CMSBlockPickerPanel';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PreviewDevice = 'mobile' | 'tablet' | 'desktop';

export const CMSStudio = () => {
  const [selectedContentId, setSelectedContentId] = useState<string | null>('1');
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop');
  const [isBlockPickerOpen, setIsBlockPickerOpen] = useState(false);
  const editorRef = useRef<{ insertBlock: (blockId: string) => void } | null>(null);

  const handleNewContent = () => {
    // In a real app, this would create a new content item
    console.log('Creating new content');
  };

  const handleInsertBlock = useCallback((blockId: string) => {
    // In a real implementation, this would insert the block into Editor.js
    console.log('Inserting block:', blockId);
    // Keep panel open for rapid building
  }, []);

  const handleOpenBlockPicker = () => {
    setIsBlockPickerOpen(true);
  };

  const handleCloseBlockPicker = () => {
    setIsBlockPickerOpen(false);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC to close panel
      if (e.key === 'Escape' && isBlockPickerOpen) {
        handleCloseBlockPicker();
      }
      // "/" to open panel when in editor
      if (e.key === '/' && !isBlockPickerOpen && selectedContentId) {
        // Only open if not already typing in an input
        const target = e.target as HTMLElement;
        if (!['INPUT', 'TEXTAREA'].includes(target.tagName) && !target.isContentEditable) {
          e.preventDefault();
          handleOpenBlockPicker();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isBlockPickerOpen, selectedContentId]);

  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      {/* Left Sidebar - Content Library */}
      <CMSLeftSidebar
        selectedContentId={selectedContentId}
        onSelectContent={setSelectedContentId}
        onNewContent={handleNewContent}
      />

      {/* Center - Editor Canvas with Add Block Button */}
      <div className="flex-1 flex flex-col relative">
        <CMSEditorCanvas
          contentId={selectedContentId}
          onDataChange={(data) => {
            // Handle autosave
            console.log('Content changed:', data);
          }}
        />

        {/* Floating Add Block Button */}
        {selectedContentId && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-6 right-6 z-10"
          >
            <Button
              onClick={handleOpenBlockPicker}
              className="gap-2 shadow-lg"
              size="sm"
            >
              <Plus size={16} />
              Add Block
            </Button>
          </motion.div>
        )}

        {/* Editor canvas dimming when block picker is open */}
        <AnimatePresence>
          {isBlockPickerOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10"
              onClick={handleCloseBlockPicker}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Right Panel - Metadata & Settings (when block picker is closed) */}
      <AnimatePresence mode="wait">
        {!isBlockPickerOpen ? (
          <motion.div
            key="right-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <CMSRightPanel
              contentId={selectedContentId}
              previewDevice={previewDevice}
              onPreviewDeviceChange={setPreviewDevice}
            />
          </motion.div>
        ) : (
          <CMSBlockPickerPanel
            key="block-picker"
            isOpen={isBlockPickerOpen}
            onClose={handleCloseBlockPicker}
            onInsertBlock={handleInsertBlock}
            userRole="tenant_admin"
          />
        )}
      </AnimatePresence>
    </div>
  );
};
