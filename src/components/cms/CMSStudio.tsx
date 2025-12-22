import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CMSLeftSidebar } from './CMSLeftSidebar';
import { CMSEditorCanvas, CMSEditorCanvasHandle } from './CMSEditorCanvas';
import { CMSRightPanel } from './CMSRightPanel';
import { CMSBlockPickerPanel } from './CMSBlockPickerPanel';
import { Plus, X } from 'lucide-react';
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
    toast.success('New content created');
  }, []);

  const handleInsertBlock = useCallback(async (blockId: string) => {
    if (editorRef.current) {
      await editorRef.current.insertBlock(blockId);
      toast.success(`${blockId} block added`);
    }
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isBlockPickerOpen) {
        setIsBlockPickerOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isBlockPickerOpen]);

  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      {/* Left Sidebar */}
      <CMSLeftSidebar
        selectedContentId={selectedContentId}
        onSelectContent={setSelectedContentId}
        onNewContent={handleNewContent}
        contentItems={contentItems}
      />

      {/* Center - Editor */}
      <div className="flex-1 flex flex-col relative min-w-0">
        <CMSEditorCanvas
          ref={editorRef}
          contentId={selectedContentId}
          onDataChange={(data) => {
            console.log('Content saved:', data.blocks.length, 'blocks');
          }}
        />

        {/* Add Block Button */}
        {selectedContentId && !isBlockPickerOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-6 right-6 z-10"
          >
            <Button
              onClick={() => setIsBlockPickerOpen(true)}
              size="sm"
              className="gap-2 shadow-lg"
            >
              <Plus size={16} />
              Add Block
            </Button>
          </motion.div>
        )}

        {/* Overlay when block picker is open */}
        <AnimatePresence>
          {isBlockPickerOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/40 backdrop-blur-[1px] z-10"
              onClick={() => setIsBlockPickerOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Right Panel */}
      {isBlockPickerOpen ? (
        <CMSBlockPickerPanel
          isOpen={isBlockPickerOpen}
          onClose={() => setIsBlockPickerOpen(false)}
          onInsertBlock={handleInsertBlock}
          userRole="tenant_admin"
        />
      ) : (
        <CMSRightPanel
          contentId={selectedContentId}
          previewDevice={previewDevice}
          onPreviewDeviceChange={setPreviewDevice}
        />
      )}
    </div>
  );
};
