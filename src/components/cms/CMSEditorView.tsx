import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Pencil,
  Eye,
  Send,
  Settings,
  LayoutGrid,
  GitCompare,
  History,
  Save,
  Calendar,
  Smartphone,
  Tablet,
  Monitor,
  Plus,
  Image,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CMSEditorCanvas, CMSEditorCanvasHandle } from './CMSEditorCanvas';
import { CMSBlockPicker } from './CMSBlockPicker';
import { CMSSettingsPanel } from './CMSSettingsPanel';
import { CMSVersionHistory } from './CMSVersionHistory';
import { CMSTemplatePanel } from './CMSTemplatePanel';
import { CMSMediaLibrary } from './CMSMediaLibrary';
import { BlockTemplate } from './templates/templateLibrary';
import { toast } from 'sonner';

type EditorTab = 'edit' | 'preview' | 'distribute' | 'settings';
type PreviewDevice = 'mobile' | 'tablet' | 'desktop';
type RightPanel = 'blocks' | 'templates' | 'history' | null;

interface CMSEditorViewProps {
  contentId: string;
  onBack: () => void;
}

export const CMSEditorView = ({ contentId, onBack }: CMSEditorViewProps) => {
  const [activeTab, setActiveTab] = useState<EditorTab>('edit');
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop');
  const [rightPanel, setRightPanel] = useState<RightPanel>(null);
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const editorRef = useRef<CMSEditorCanvasHandle>(null);

  const contentTitle = contentId.startsWith('new') ? 'Untitled Content' : 'Getting Started Guide';
  const contentStatus = contentId.startsWith('new') ? 'draft' : 'published';

  const handleInsertBlock = useCallback(async (blockId: string) => {
    if (editorRef.current) {
      await editorRef.current.insertBlock(blockId);
      toast.success('Block added');
    }
    setRightPanel(null);
  }, []);

  const handleInsertTemplate = useCallback(async (template: BlockTemplate) => {
    if (editorRef.current) {
      for (const block of template.blocks) {
        await editorRef.current.insertBlock(block.type, block.data as Record<string, unknown>);
      }
      toast.success(`${template.name} template added`);
    }
    setRightPanel(null);
  }, []);

  const handleRestore = (versionId: string) => {
    toast.success('Version restored', { description: `Restored to version ${versionId}` });
    setRightPanel(null);
  };

  const handlePreviewVersion = (versionId: string) => {
    toast.info('Preview mode', { description: `Previewing version ${versionId}` });
  };

  const getDeviceWidth = () => {
    switch (previewDevice) {
      case 'mobile':
        return 375;
      case 'tablet':
        return 768;
      default:
        return '100%';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background overflow-hidden">
      {/* Top Toolbar - Responsive */}
      <div className="min-h-[56px] border-b border-border flex flex-col sm:flex-row sm:items-center justify-between px-3 sm:px-4 py-2 sm:py-0 bg-card gap-2">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft size={18} />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="hidden sm:block w-px h-6 bg-border" />
          <span className="font-medium text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">{contentTitle}</span>
          <span
            className={cn(
              'px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full capitalize flex-shrink-0',
              contentStatus === 'draft'
                ? 'bg-orange-500/10 text-orange-600'
                : 'bg-green-500/10 text-green-600'
            )}
          >
            {contentStatus}
          </span>
          <span className="hidden lg:flex items-center gap-1.5 text-sm text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Only you
          </span>
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsMediaLibraryOpen(true)}>
            <Image size={14} />
            Media
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setRightPanel(rightPanel === 'templates' ? null : 'templates')}>
            <LayoutGrid size={14} />
            Templates
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => toast.info('Compare feature coming soon')}>
            <GitCompare size={14} />
            Compare
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setRightPanel(rightPanel === 'history' ? null : 'history')}>
            <History size={14} />
            History
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Save size={14} />
            Save Draft
          </Button>
          <Button size="sm" className="gap-2">
            <Send size={14} />
            Publish
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center gap-2 self-end">
          <Button size="sm" className="gap-2" onClick={() => toast.success('Content saved')}>
            <Save size={14} />
            Save
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-b border-border bg-card overflow-hidden"
          >
            <div className="p-3 grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="gap-2 justify-start" onClick={() => { setIsMediaLibraryOpen(true); setIsMobileMenuOpen(false); }}>
                <Image size={14} />
                Media
              </Button>
              <Button variant="outline" size="sm" className="gap-2 justify-start" onClick={() => { setRightPanel('templates'); setIsMobileMenuOpen(false); }}>
                <LayoutGrid size={14} />
                Templates
              </Button>
              <Button variant="outline" size="sm" className="gap-2 justify-start" onClick={() => { setRightPanel('history'); setIsMobileMenuOpen(false); }}>
                <History size={14} />
                History
              </Button>
              <Button variant="outline" size="sm" className="gap-2 justify-start" onClick={() => toast.info('Compare feature coming soon')}>
                <GitCompare size={14} />
                Compare
              </Button>
              <Button size="sm" className="gap-2 justify-start col-span-2">
                <Send size={14} />
                Publish
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Secondary Tabs - Scrollable on mobile */}
      <div className="h-12 border-b border-border flex items-center px-2 sm:px-4 bg-card/50 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1">
          {[
            { id: 'edit' as EditorTab, label: 'Edit', icon: Pencil },
            { id: 'preview' as EditorTab, label: 'Preview', icon: Eye },
            { id: 'distribute' as EditorTab, label: 'Distribute', icon: Send },
            { id: 'settings' as EditorTab, label: 'Settings', icon: Settings },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                'flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg transition-colors whitespace-nowrap',
                activeTab === id
                  ? 'bg-muted text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Device Toggle (Preview Mode) */}
        {activeTab === 'preview' && (
          <div className="flex items-center gap-1 ml-auto bg-muted rounded-lg p-1 flex-shrink-0">
            {[
              { id: 'mobile' as PreviewDevice, icon: Smartphone, label: 'Mobile' },
              { id: 'tablet' as PreviewDevice, icon: Tablet, label: 'Tablet' },
              { id: 'desktop' as PreviewDevice, icon: Monitor, label: 'Desktop' },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setPreviewDevice(id)}
                title={label}
                className={cn(
                  'flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-md transition-colors',
                  previewDevice === id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Editor/Preview Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'edit' && (
            <div className="flex-1 flex flex-col relative">
              <CMSEditorCanvas
                ref={editorRef}
                contentId={contentId}
                onDataChange={(data) => {
                  console.log('Content saved:', data.blocks.length, 'blocks');
                }}
              />

              {/* Add Block Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6"
              >
                <Button
                  onClick={() => setRightPanel(rightPanel === 'blocks' ? null : 'blocks')}
                  size="sm"
                  className="gap-2 shadow-lg"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Add Block</span>
                </Button>
              </motion.div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="flex-1 flex flex-col items-center justify-start bg-muted/30 p-4 sm:p-8 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ width: typeof getDeviceWidth() === 'number' ? getDeviceWidth() : undefined }}
                className={cn(
                  'bg-background rounded-2xl shadow-xl overflow-hidden w-full',
                  previewDevice === 'mobile' && 'max-w-[375px]',
                  previewDevice === 'tablet' && 'max-w-[768px]'
                )}
              >
                {previewDevice !== 'desktop' && (
                  <div className="h-6 bg-muted flex items-center justify-center">
                    <div className="w-16 h-1 bg-muted-foreground/30 rounded-full" />
                  </div>
                )}
                <div className="p-6 sm:p-8 min-h-[300px] sm:min-h-[400px]">
                  <h1 className="text-2xl sm:text-3xl font-bold mb-4">Welcome</h1>
                  <button className="px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg font-medium text-sm sm:text-base">
                    Get Started
                  </button>
                </div>
              </motion.div>
              <div className="mt-4 text-xs sm:text-sm text-muted-foreground">
                {previewDevice === 'mobile' && '375px • Mobile View'}
                {previewDevice === 'tablet' && '768px • Tablet View'}
                {previewDevice === 'desktop' && '100% • Desktop View'}
              </div>
            </div>
          )}

          {activeTab === 'distribute' && (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <Send size={40} className="mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-lg sm:text-xl font-semibold mb-2">Distribution Settings</h2>
                <p className="text-sm text-muted-foreground max-w-md">
                  Configure where and how this content should be distributed across your platform.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Content Settings</h2>
                <CMSSettingsPanel contentId={contentId} />
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Full screen on mobile */}
        <AnimatePresence>
          {rightPanel && (
            <>
              {/* Overlay for mobile */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
                onClick={() => setRightPanel(null)}
              />
              <motion.div
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed lg:relative right-0 top-0 h-full w-full sm:w-80 lg:w-80 border-l border-border bg-card overflow-hidden z-50"
              >
                {rightPanel === 'blocks' && (
                  <CMSBlockPicker
                    onInsertBlock={handleInsertBlock}
                    onClose={() => setRightPanel(null)}
                  />
                )}
                {rightPanel === 'templates' && (
                  <CMSTemplatePanel
                    onInsertTemplate={handleInsertTemplate}
                    onClose={() => setRightPanel(null)}
                  />
                )}
                {rightPanel === 'history' && (
                  <CMSVersionHistory
                    contentId={contentId}
                    onRestore={handleRestore}
                    onPreview={handlePreviewVersion}
                  />
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Media Library Modal */}
      <CMSMediaLibrary
        isOpen={isMediaLibraryOpen}
        onClose={() => setIsMediaLibraryOpen(false)}
      />
    </div>
  );
};
