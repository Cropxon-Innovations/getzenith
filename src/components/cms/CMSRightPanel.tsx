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
  MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type PreviewDevice = 'mobile' | 'tablet' | 'desktop';

interface CMSRightPanelProps {
  contentId: string | null;
  previewDevice: PreviewDevice;
  onPreviewDeviceChange: (device: PreviewDevice) => void;
}

export const CMSRightPanel = ({ contentId, previewDevice, onPreviewDeviceChange }: CMSRightPanelProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    metadata: true,
    visibility: true,
    publishing: false,
    automation: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (!contentId) {
    return (
      <div className="w-72 h-full bg-card border-l border-border flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Select content to view details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-72 h-full bg-card border-l border-border flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Content Details</h3>
          <button className="p-1 rounded hover:bg-secondary transition-colors">
            <MoreHorizontal size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* Preview Device Toggle */}
        <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg">
          {[
            { key: 'mobile' as PreviewDevice, icon: Smartphone, label: '375px' },
            { key: 'tablet' as PreviewDevice, icon: Tablet, label: '768px' },
            { key: 'desktop' as PreviewDevice, icon: Monitor, label: '1280px' },
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => onPreviewDeviceChange(key)}
              className={cn(
                'flex-1 flex flex-col items-center gap-0.5 py-2 rounded-md transition-colors',
                previewDevice === key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon size={16} />
              <span className="text-[9px]">{label}</span>
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
                      <Link2 size={14} className="text-muted-foreground" />
                      <input
                        type="text"
                        defaultValue="getting-started-guide"
                        className="flex-1 text-xs bg-secondary/50 border border-border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  {/* Content Type */}
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Content Type</label>
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
                      {['guide', 'getting-started', 'tutorial'].map(tag => (
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

                  {/* Created / Updated */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Created</label>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarDays size={12} />
                        <span>Dec 15, 2024</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Updated</label>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock size={12} />
                        <span>2 hours ago</span>
                      </div>
                    </div>
                  </div>

                  {/* Author */}
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Author</label>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-medium">
                        JD
                      </div>
                      <span className="text-xs">John Doe</span>
                    </div>
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
                        { key: 'published', label: 'Published', color: 'bg-green-500' },
                      ].map(({ key, label, color }) => (
                        <button
                          key={key}
                          className={cn(
                            'flex items-center justify-center gap-1.5 py-1.5 rounded text-xs transition-colors',
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
                        { icon: Globe, label: 'Public', desc: 'Anyone can view' },
                        { icon: Users, label: 'Members', desc: 'Logged in users only' },
                        { icon: Lock, label: 'Private', desc: 'Selected roles only' },
                      ].map(({ icon: Icon, label, desc }) => (
                        <button
                          key={label}
                          className={cn(
                            'w-full flex items-center gap-3 p-2 rounded-md text-left transition-colors',
                            label === 'Public'
                              ? 'bg-primary/10 border border-primary/30'
                              : 'hover:bg-secondary/50'
                          )}
                        >
                          <Icon size={14} className={label === 'Public' ? 'text-primary' : 'text-muted-foreground'} />
                          <div>
                            <div className="text-xs font-medium">{label}</div>
                            <div className="text-[10px] text-muted-foreground">{desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Publishing Section */}
        <div className="border-b border-border">
          <button
            onClick={() => toggleSection('publishing')}
            className="w-full flex items-center justify-between p-4 text-sm font-medium hover:bg-secondary/30 transition-colors"
          >
            <span>Publishing</span>
            <ChevronDown 
              size={16} 
              className={cn('transition-transform', expandedSections.publishing && 'rotate-180')} 
            />
          </button>
          
          <AnimatePresence>
            {expandedSections.publishing && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Publish to</label>
                    <div className="space-y-1.5">
                      {[
                        { label: 'Website', checked: true },
                        { label: 'LMS', checked: true },
                        { label: 'Email', checked: false },
                        { label: 'API', checked: true },
                      ].map(({ label, checked }) => (
                        <label key={label} className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            defaultChecked={checked}
                            className="w-3.5 h-3.5 rounded border-border text-primary focus:ring-primary/50"
                          />
                          <span className="text-xs">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Schedule */}
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Schedule</label>
                    <input
                      type="datetime-local"
                      className="w-full text-xs bg-secondary/50 border border-border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Automation Hooks Section */}
        <div className="border-b border-border">
          <button
            onClick={() => toggleSection('automation')}
            className="w-full flex items-center justify-between p-4 text-sm font-medium hover:bg-secondary/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-yellow-500" />
              <span>Automation Hooks</span>
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
                <div className="px-4 pb-4 space-y-3">
                  <p className="text-[10px] text-muted-foreground">
                    Trigger automations when this content changes state.
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

                  <button className="w-full text-xs text-primary hover:underline">
                    + Add automation hook
                  </button>
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
          Publish Changes
        </Button>
      </div>
    </div>
  );
};