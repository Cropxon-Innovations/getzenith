import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  FolderOpen,
  Image,
  FileCheck,
  FileClock,
  Layers,
  LayoutTemplate,
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContentItem {
  id: string;
  title: string;
  type: string;
  status: 'draft' | 'preview' | 'published';
  updatedAt: string;
}

const contentTypes = [
  { id: 'article', label: 'Article', count: 45 },
  { id: 'documentation', label: 'Documentation', count: 23 },
  { id: 'lesson', label: 'Lesson', count: 18 },
  { id: 'announcement', label: 'Announcement', count: 8 },
  { id: 'email', label: 'Email Content', count: 12 },
  { id: 'section', label: 'Reusable Section', count: 34 },
];

interface CMSLeftSidebarProps {
  selectedContentId: string | null;
  onSelectContent: (id: string) => void;
  onNewContent: () => void;
  contentItems?: ContentItem[];
}

const defaultContentItems: ContentItem[] = [
  { id: '1', title: 'Getting Started Guide', type: 'article', status: 'published', updatedAt: '2h ago' },
  { id: '2', title: 'Product Announcement', type: 'announcement', status: 'draft', updatedAt: '5h ago' },
  { id: '3', title: 'Introduction to React', type: 'lesson', status: 'published', updatedAt: '1d ago' },
  { id: '4', title: 'API Documentation', type: 'documentation', status: 'preview', updatedAt: '2d ago' },
  { id: '5', title: 'Welcome Email Template', type: 'email', status: 'published', updatedAt: '3d ago' },
];

export const CMSLeftSidebar = ({ 
  selectedContentId, 
  onSelectContent, 
  onNewContent,
  contentItems = defaultContentItems 
}: CMSLeftSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    library: true,
    types: false,
    templates: false,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const filteredContent = contentItems.filter(item => {
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (activeFilter === 'draft' && item.status !== 'draft') return false;
    if (activeFilter === 'published' && item.status !== 'published') return false;
    return true;
  });

  return (
    <div className="w-64 h-full bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">Content</h2>
          <button 
            onClick={onNewContent}
            className="p-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            title="Create new content"
          >
            <Plus size={14} />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-3 text-xs rounded-md bg-secondary/50 border border-border placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-2 border-b border-border">
        {[
          { key: 'all', label: 'All', icon: FolderOpen },
          { key: 'draft', label: 'Drafts', icon: FileClock },
          { key: 'published', label: 'Published', icon: FileCheck },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key as typeof activeFilter)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs transition-colors',
              activeFilter === key
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-secondary/50'
            )}
          >
            <Icon size={12} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Content List */}
      <div className="flex-1 overflow-y-auto">
        {/* Content Library Section */}
        <div className="p-2">
          <button
            onClick={() => toggleSection('library')}
            className="w-full flex items-center justify-between p-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="uppercase tracking-wider">Content Library</span>
            {expandedSections.library ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          
          <AnimatePresence>
            {expandedSections.library && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-0.5 overflow-hidden"
              >
                {filteredContent.length === 0 ? (
                  <div className="p-4 text-center text-xs text-muted-foreground">
                    No content found
                  </div>
                ) : (
                  filteredContent.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onSelectContent(item.id)}
                      className={cn(
                        'w-full flex items-center gap-2 p-2 rounded-md text-left transition-all',
                        selectedContentId === item.id
                          ? 'bg-primary/10 border border-primary/30'
                          : 'hover:bg-secondary/50'
                      )}
                    >
                      <FileText size={14} className="text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate">{item.title}</div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <span className="capitalize">{item.type}</span>
                          <span>•</span>
                          <span>{item.updatedAt}</span>
                        </div>
                      </div>
                      <div className={cn(
                        'w-1.5 h-1.5 rounded-full flex-shrink-0',
                        item.status === 'published' ? 'bg-green-500' :
                        item.status === 'preview' ? 'bg-blue-500' : 'bg-yellow-500'
                      )} />
                    </button>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content Types Section */}
        <div className="p-2 border-t border-border">
          <button
            onClick={() => toggleSection('types')}
            className="w-full flex items-center justify-between p-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="uppercase tracking-wider">Content Types</span>
            {expandedSections.types ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          
          <AnimatePresence>
            {expandedSections.types && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-0.5 overflow-hidden"
              >
                {contentTypes.map((type) => (
                  <button
                    key={type.id}
                    className="w-full flex items-center justify-between p-2 rounded-md text-left hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Layers size={14} className="text-muted-foreground" />
                      <span className="text-xs">{type.label}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                      {type.count}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Templates Section */}
        <div className="p-2 border-t border-border">
          <button
            onClick={() => toggleSection('templates')}
            className="w-full flex items-center justify-between p-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="uppercase tracking-wider">Templates</span>
            {expandedSections.templates ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          
          <AnimatePresence>
            {expandedSections.templates && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-0.5 overflow-hidden"
              >
                {['Blog Post', 'Lesson', 'Announcement', 'Documentation'].map((template) => (
                  <button
                    key={template}
                    className="w-full flex items-center gap-2 p-2 rounded-md text-left hover:bg-secondary/50 transition-colors"
                  >
                    <LayoutTemplate size={14} className="text-muted-foreground" />
                    <span className="text-xs">{template}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Media Library Quick Access */}
      <div className="p-3 border-t border-border">
        <button className="w-full flex items-center gap-2 p-2 rounded-md text-xs text-muted-foreground hover:bg-secondary/50 transition-colors">
          <Image size={14} />
          <span>Media Library</span>
          <span className="ml-auto text-[10px] bg-secondary px-1.5 py-0.5 rounded">2.3K</span>
        </button>
      </div>
    </div>
  );
};
