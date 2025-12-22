import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OutputData } from '@editorjs/editorjs';
import {
  ChevronLeft, Pencil, Eye, Send, Settings, LayoutGrid, History,
  Save, Smartphone, Tablet, Monitor, Plus, Image, Menu, X, Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CMSEditorCanvas, CMSEditorCanvasHandle } from './CMSEditorCanvas';
import { CMSBlockPicker } from './CMSBlockPicker';
import { CMSSettingsPanel } from './CMSSettingsPanel';
import { CMSVersionHistory } from './CMSVersionHistory';
import { CMSTemplatePanel } from './CMSTemplatePanel';
import { CMSMediaLibrary } from './CMSMediaLibrary';
import { CMSDistributePanel } from './CMSDistributePanel';
import { CMSContentRenderer } from './render/CMSContentRenderer';
import { CollaboratorAvatars } from './collab/CollaboratorAvatars';
import { BlockTemplate } from './templates/templateLibrary';
import { useCMSContent } from './state/CMSContentStore';
import { toast } from 'sonner';

type EditorTab = 'edit' | 'preview' | 'distribute' | 'settings';
type PreviewDevice = 'mobile' | 'tablet' | 'desktop';
type RightPanel = 'blocks' | 'templates' | 'history' | null;

interface CMSEditorViewProps {
  contentId: string;
  onBack: () => void;
}

export const CMSEditorView = ({ contentId, onBack }: CMSEditorViewProps) => {
  const { getContentById, updateContentData, publishContent, saveVersion } = useCMSContent();
  const [activeTab, setActiveTab] = useState<EditorTab>('edit');
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop');
  const [rightPanel, setRightPanel] = useState<RightPanel>(null);
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [previewData, setPreviewData] = useState<OutputData | null>(null);
  const editorRef = useRef<CMSEditorCanvasHandle>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const content = getContentById(contentId);
  const contentTitle = content?.title || 'Untitled Content';
  const contentStatus = content?.status || 'draft';

  // Autosave with debounce
  const handleDataChange = useCallback((data: OutputData) => {
    setPreviewData(data);
    
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      updateContentData(contentId, data);
      setLastSaved(new Date());
    }, 800);
  }, [contentId, updateContentData]);

  useEffect(() => {
    return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); };
  }, []);

  const handleInsertBlock = useCallback(async (blockId: string) => {
    if (!editorRef.current) {
      toast.error('Editor not ready', { description: 'Please wait a moment and try again.' });
      return;
    }
    
    const result = await editorRef.current.insertBlock(blockId);
    if (result.ok) {
      toast.success('Block added');
    } else {
      toast.error('Failed to add block', { description: result.reason === 'EDITOR_NOT_READY' ? 'Editor is still loading' : result.error });
    }
    setRightPanel(null);
  }, []);

  const handleInsertTemplate = useCallback(async (template: BlockTemplate) => {
    if (!editorRef.current) {
      toast.error('Editor not ready');
      return;
    }
    
    let successCount = 0;
    for (const block of template.blocks) {
      const result = await editorRef.current.insertBlock(block.type, block.data as Record<string, unknown>);
      if (result.ok) successCount++;
    }
    
    if (successCount === template.blocks.length) {
      toast.success(`${template.name} template added`);
    } else if (successCount > 0) {
      toast.warning(`Added ${successCount}/${template.blocks.length} blocks`);
    } else {
      toast.error('Failed to add template');
    }
    setRightPanel(null);
  }, []);

  const handlePublish = useCallback(() => {
    saveVersion(contentId, 'Published content');
    publishContent(contentId);
    toast.success('Content published!');
  }, [contentId, publishContent, saveVersion]);

  const handleSaveDraft = useCallback(() => {
    saveVersion(contentId, 'Manual save');
    toast.success('Draft saved');
  }, [contentId, saveVersion]);

  const handleRestore = (versionId: string) => {
    toast.success('Version restored');
    setRightPanel(null);
  };

  const getDeviceWidth = () => {
    switch (previewDevice) {
      case 'mobile': return 375;
      case 'tablet': return 768;
      default: return '100%';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background overflow-hidden">
      {/* Top Toolbar */}
      <div className="min-h-[56px] border-b border-border flex flex-col sm:flex-row sm:items-center justify-between px-3 sm:px-4 py-2 sm:py-0 bg-card gap-2">
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={18} />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="hidden sm:block w-px h-6 bg-border" />
          <span className="font-medium text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">{contentTitle}</span>
          <span className={cn(
            'px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full capitalize flex-shrink-0',
            contentStatus === 'draft' ? 'bg-orange-500/10 text-orange-600' : 'bg-green-500/10 text-green-600'
          )}>
            {contentStatus}
          </span>
          {lastSaved && (
            <span className="hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground">
              <Check size={12} className="text-green-500" />
              Saved
            </span>
          )}
          <div className="hidden lg:block">
            <CollaboratorAvatars />
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsMediaLibraryOpen(true)}>
            <Image size={14} />Media
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setRightPanel(rightPanel === 'templates' ? null : 'templates')}>
            <LayoutGrid size={14} />Templates
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setRightPanel(rightPanel === 'history' ? null : 'history')}>
            <History size={14} />History
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleSaveDraft}>
            <Save size={14} />Save Draft
          </Button>
          <Button size="sm" className="gap-2" onClick={handlePublish}>
            <Send size={14} />Publish
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="flex lg:hidden items-center gap-2 self-end">
          <Button size="sm" className="gap-2" onClick={handleSaveDraft}><Save size={14} />Save</Button>
          <Button variant="outline" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden border-b border-border bg-card overflow-hidden">
            <div className="p-3 grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="gap-2 justify-start" onClick={() => { setIsMediaLibraryOpen(true); setIsMobileMenuOpen(false); }}><Image size={14} />Media</Button>
              <Button variant="outline" size="sm" className="gap-2 justify-start" onClick={() => { setRightPanel('templates'); setIsMobileMenuOpen(false); }}><LayoutGrid size={14} />Templates</Button>
              <Button variant="outline" size="sm" className="gap-2 justify-start" onClick={() => { setRightPanel('history'); setIsMobileMenuOpen(false); }}><History size={14} />History</Button>
              <Button size="sm" className="gap-2 justify-start" onClick={handlePublish}><Send size={14} />Publish</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Secondary Tabs */}
      <div className="h-12 border-b border-border flex items-center px-2 sm:px-4 bg-card/50 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1">
          {[
            { id: 'edit' as EditorTab, label: 'Edit', icon: Pencil },
            { id: 'preview' as EditorTab, label: 'Preview', icon: Eye },
            { id: 'distribute' as EditorTab, label: 'Distribute', icon: Send },
            { id: 'settings' as EditorTab, label: 'Settings', icon: Settings },
          ].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)} className={cn(
              'flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg transition-colors whitespace-nowrap',
              activeTab === id ? 'bg-muted text-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}>
              <Icon size={14} />{label}
            </button>
          ))}
        </div>

        {activeTab === 'preview' && (
          <div className="flex items-center gap-1 ml-auto bg-muted rounded-lg p-1 flex-shrink-0">
            {[
              { id: 'mobile' as PreviewDevice, icon: Smartphone, label: 'Mobile' },
              { id: 'tablet' as PreviewDevice, icon: Tablet, label: 'Tablet' },
              { id: 'desktop' as PreviewDevice, icon: Monitor, label: 'Desktop' },
            ].map(({ id, icon: Icon, label }) => (
              <button key={id} onClick={() => setPreviewDevice(id)} title={label} className={cn(
                'flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-md transition-colors',
                previewDevice === id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}>
                <Icon size={14} /><span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'edit' && (
            <div className="flex-1 flex flex-col relative">
              <CMSEditorCanvas ref={editorRef} contentId={contentId} onDataChange={handleDataChange} onRequestAddBlock={() => setRightPanel('blocks')} />
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6">
                <Button onClick={() => setRightPanel(rightPanel === 'blocks' ? null : 'blocks')} size="sm" className="gap-2 shadow-lg">
                  <Plus size={16} /><span className="hidden sm:inline">Add Block</span>
                </Button>
              </motion.div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="flex-1 flex flex-col items-center justify-start bg-muted/30 p-4 sm:p-8 overflow-y-auto">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ width: typeof getDeviceWidth() === 'number' ? getDeviceWidth() : undefined }} className={cn('bg-background rounded-2xl shadow-xl overflow-hidden w-full', previewDevice === 'mobile' && 'max-w-[375px]', previewDevice === 'tablet' && 'max-w-[768px]')}>
                {previewDevice !== 'desktop' && <div className="h-6 bg-muted flex items-center justify-center"><div className="w-16 h-1 bg-muted-foreground/30 rounded-full" /></div>}
                <div className="p-6 sm:p-8 min-h-[300px] sm:min-h-[400px]">
                  {previewData ? <CMSContentRenderer data={previewData} /> : <p className="text-muted-foreground text-center py-12">No content to preview. Start editing to see changes.</p>}
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
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <CMSDistributePanel contentId={contentId} status={contentStatus} slug={content?.slug} />
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

        {/* Right Panel */}
        <AnimatePresence>
          {rightPanel && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40" onClick={() => setRightPanel(null)} />
              <motion.div initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0 }} transition={{ duration: 0.2 }} className="fixed lg:relative right-0 top-0 h-full w-full sm:w-80 lg:w-80 border-l border-border bg-card overflow-hidden z-50">
                {rightPanel === 'blocks' && <CMSBlockPicker onInsertBlock={handleInsertBlock} onClose={() => setRightPanel(null)} />}
                {rightPanel === 'templates' && <CMSTemplatePanel onInsertTemplate={handleInsertTemplate} onClose={() => setRightPanel(null)} />}
                {rightPanel === 'history' && <CMSVersionHistory contentId={contentId} onRestore={handleRestore} onPreview={() => {}} />}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <CMSMediaLibrary isOpen={isMediaLibraryOpen} onClose={() => setIsMediaLibraryOpen(false)} />
    </div>
  );
};
