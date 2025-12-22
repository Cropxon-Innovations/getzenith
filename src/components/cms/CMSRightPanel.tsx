import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  Globe,
  Lock,
  Clock,
  Tag,
  Link2,
  Smartphone,
  Tablet,
  Monitor,
  ChevronDown,
  Zap,
  Users,
  CalendarDays,
  History,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CMSVersionHistory } from './CMSVersionHistory';
import { toast } from 'sonner';

type PreviewDevice = 'mobile' | 'tablet' | 'desktop';
type RightPanelTab = 'settings' | 'history';

interface CMSRightPanelProps {
  contentId: string | null;
  previewDevice: PreviewDevice;
  onPreviewDeviceChange: (device: PreviewDevice) => void;
}

export const CMSRightPanel = ({ contentId, previewDevice, onPreviewDeviceChange }: CMSRightPanelProps) => {
  const [activeTab, setActiveTab] = useState<RightPanelTab>('settings');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    metadata: true,
    visibility: true,
    automation: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleRestore = (versionId: string) => {
    toast.success('Version restored', {
      description: `Restored to version ${versionId}`
    });
  };

  const handlePreviewVersion = (versionId: string) => {
    toast.info('Preview mode', {
      description: `Previewing version ${versionId}`
    });
  };

  if (!contentId) {
    return (
      <div className="w-72 h-full bg-card border-l border-border flex items-center justify-center p-6">
        <p className="text-sm text-muted-foreground text-center">
          Select content to view details
        </p>
      </div>
    );
  }

  return (
    <div className="w-72 h-full bg-card border-l border-border flex flex-col overflow-hidden">
      {/* Tab Header */}
      <div className="flex border-b border-border">
        {[
          { id: 'settings' as RightPanelTab, label: 'Settings' },
          { id: 'history' as RightPanelTab, label: 'History', icon: History },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium transition-colors border-b-2',
              activeTab === id
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {Icon && <Icon size={14} />}
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'history' ? (
        <CMSVersionHistory
          contentId={contentId}
          onRestore={handleRestore}
          onPreview={handlePreviewVersion}
        />
      ) : (
        <>
          {/* Preview Device Toggle */}
          <div className="p-4 border-b border-border">
            <label className="text-xs text-muted-foreground mb-2 block">Preview</label>
            <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg">
              {[
                { key: 'mobile' as PreviewDevice, icon: Smartphone, label: 'Mobile' },
                { key: 'tablet' as PreviewDevice, icon: Tablet, label: 'Tablet' },
                { key: 'desktop' as PreviewDevice, icon: Monitor, label: 'Desktop' },
              ].map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => onPreviewDeviceChange(key)}
                  title={label}
                  className={cn(
                    'flex-1 flex items-center justify-center py-2 rounded-md transition-colors',
                    previewDevice === key
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Metadata Section */}
            <div className="border-b border-border">
              <button
                onClick={() => toggleSection('metadata')}
                className="w-full flex items-center justify-between p-4 text-sm font-medium hover:bg-secondary/30 transition-colors"
              >
                <span>Metadata</span>
                <ChevronDown 
                  size={16} 
                  className={cn('transition-transform', expandedSections.metadata && 'rotate-180')} 
                />
              </button>
              
              <AnimatePresence>
                {expandedSections.metadata && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-3">
                      {/* Slug */}
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Slug</label>
                        <div className="flex items-center gap-2">
                          <Link2 size={14} className="text-muted-foreground flex-shrink-0" />
                          <input
                            type="text"
                            defaultValue="getting-started-guide"
                            className="flex-1 text-xs bg-secondary/50 border border-border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/50"
                          />
                        </div>
                      </div>

                      {/* Content Type */}
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Type</label>
                        <select className="w-full text-xs bg-secondary/50 border border-border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/50">
                          <option>Article</option>
                          <option>Documentation</option>
                          <option>Lesson</option>
                          <option>Announcement</option>
                        </select>
                      </div>

                      {/* Tags */}
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Tags</label>
                        <div className="flex flex-wrap gap-1">
                          {['guide', 'tutorial'].map(tag => (
                            <span 
                              key={tag}
                              className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] bg-secondary rounded-full"
                            >
                              <Tag size={10} />
                              {tag}
                            </span>
                          ))}
                          <button className="px-2 py-0.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                            + Add
                          </button>
                        </div>
                      </div>

                      {/* Updated */}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock size={12} />
                        <span>Updated 2 hours ago</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Visibility Section */}
            <div className="border-b border-border">
              <button
                onClick={() => toggleSection('visibility')}
                className="w-full flex items-center justify-between p-4 text-sm font-medium hover:bg-secondary/30 transition-colors"
              >
                <span>Visibility</span>
                <ChevronDown 
                  size={16} 
                  className={cn('transition-transform', expandedSections.visibility && 'rotate-180')} 
                />
              </button>
              
              <AnimatePresence>
                {expandedSections.visibility && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-3">
                      {/* Status */}
                      <div>
                        <label className="text-xs text-muted-foreground mb-2 block">Status</label>
                        <div className="grid grid-cols-3 gap-1">
                          {[
                            { key: 'draft', label: 'Draft', color: 'bg-yellow-500' },
                            { key: 'preview', label: 'Preview', color: 'bg-blue-500' },
                            { key: 'published', label: 'Live', color: 'bg-green-500' },
                          ].map(({ key, label, color }) => (
                            <button
                              key={key}
                              className={cn(
                                'flex items-center justify-center gap-1.5 py-2 rounded text-xs transition-colors',
                                key === 'published'
                                  ? 'bg-green-500/10 text-green-500 border border-green-500/30'
                                  : 'border border-border hover:bg-secondary'
                              )}
                            >
                              <div className={cn('w-1.5 h-1.5 rounded-full', color)} />
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Access */}
                      <div>
                        <label className="text-xs text-muted-foreground mb-2 block">Access</label>
                        <div className="space-y-1">
                          {[
                            { icon: Globe, label: 'Public', active: true },
                            { icon: Users, label: 'Members', active: false },
                            { icon: Lock, label: 'Private', active: false },
                          ].map(({ icon: Icon, label, active }) => (
                            <button
                              key={label}
                              className={cn(
                                'w-full flex items-center gap-3 p-2 rounded-md text-left transition-colors',
                                active
                                  ? 'bg-primary/10 border border-primary/30'
                                  : 'hover:bg-secondary/50'
                              )}
                            >
                              <Icon size={14} className={active ? 'text-primary' : 'text-muted-foreground'} />
                              <span className="text-xs">{label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Automation Section */}
            <div>
              <button
                onClick={() => toggleSection('automation')}
                className="w-full flex items-center justify-between p-4 text-sm font-medium hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-yellow-500" />
                  <span>Automation</span>
                </div>
                <ChevronDown 
                  size={16} 
                  className={cn('transition-transform', expandedSections.automation && 'rotate-180')} 
                />
              </button>
              
              <AnimatePresence>
                {expandedSections.automation && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-2">
                      <p className="text-[10px] text-muted-foreground">
                        Trigger workflows when content changes.
                      </p>
                      
                      {[
                        { event: 'On Publish', workflow: 'Send notification' },
                        { event: 'On Update', workflow: 'Sync to CDN' },
                      ].map(({ event, workflow }) => (
                        <div key={event} className="flex items-center justify-between p-2 rounded bg-secondary/30 text-xs">
                          <span className="text-muted-foreground">{event}</span>
                          <span className="text-primary">{workflow}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 border-t border-border space-y-2">
            <Button className="w-full gap-2" size="sm">
              <Eye size={14} />
              Preview
            </Button>
            <Button variant="outline" className="w-full gap-2" size="sm">
              <Globe size={14} />
              Publish
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
