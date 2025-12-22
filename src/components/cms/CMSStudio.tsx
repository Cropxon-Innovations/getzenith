import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CMSLeftSidebar } from './CMSLeftSidebar';
import { CMSEditorCanvas, CMSEditorCanvasHandle } from './CMSEditorCanvas';
import { CMSRightPanel } from './CMSRightPanel';
import { CMSBlockPickerPanel } from './CMSBlockPickerPanel';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type PreviewDevice = 'mobile' | 'tablet' | 'desktop';

interface ContentItem {
  id: string;
  title: string;
  type: string;
  status: 'draft' | 'preview' | 'published';
  updatedAt: string;
}

export const CMSStudio = () => {
  const [selectedContentId, setSelectedContentId] = useState<string | null>('1');
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop');
  const [isBlockPickerOpen, setIsBlockPickerOpen] = useState(false);
  const [contentItems, setContentItems] = useState<ContentItem[]>([
    { id: '1', title: 'Getting Started Guide', type: 'article', status: 'published', updatedAt: '2h ago' },
    { id: '2', title: 'Product Announcement', type: 'announcement', status: 'draft', updatedAt: '5h ago' },
    { id: '3', title: 'Introduction to React', type: 'lesson', status: 'published', updatedAt: '1d ago' },
    { id: '4', title: 'API Documentation', type: 'documentation', status: 'preview', updatedAt: '2d ago' },
    { id: '5', title: 'Welcome Email Template', type: 'email', status: 'published', updatedAt: '3d ago' },
  ]);
  const editorRef = useRef<CMSEditorCanvasHandle>(null);

  const handleNewContent = useCallback(() => {
    const newId = `new-${Date.now()}`;
    const newContent: ContentItem = {
      id: newId,
      title: 'Untitled Content',
      type: 'article',
      status: 'draft',
      updatedAt: 'Just now'
    };
    
    setContentItems(prev => [newContent, ...prev]);
    setSelectedContentId(newId);
    toast.success('New content created', {
      description: 'Start editing your new content item.'
    });
  }, []);

  const handleInsertBlock = useCallback(async (blockId: string) => {
    if (editorRef.current) {
      await editorRef.current.insertBlock(blockId);
      toast.success(`${blockId.charAt(0).toUpperCase() + blockId.slice(1)} block added`, {
        description: 'Block inserted at cursor position.'
      });
    }
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
        contentItems={contentItems}
      />

      {/* Center - Editor Canvas with Add Block Button */}
      <div className="flex-1 flex flex-col relative">
        <CMSEditorCanvas
          ref={editorRef}
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
      {!isBlockPickerOpen ? (
        <CMSRightPanel
          contentId={selectedContentId}
          previewDevice={previewDevice}
          onPreviewDeviceChange={setPreviewDevice}
        />
      ) : (
        <CMSBlockPickerPanel
          isOpen={isBlockPickerOpen}
          onClose={handleCloseBlockPicker}
          onInsertBlock={handleInsertBlock}
          userRole="tenant_admin"
        />
      )}
    </div>
  );
};
