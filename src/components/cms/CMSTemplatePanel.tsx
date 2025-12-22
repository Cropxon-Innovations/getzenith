import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Layout,
  FileText,
  BookOpen,
  Mail,
  Zap,
  Building2,
  LayoutGrid,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  BlockTemplate,
  templateCategories,
  searchTemplates,
} from './templates/templateLibrary';

interface CMSTemplatePanelProps {
  onInsertTemplate: (template: BlockTemplate) => void;
  onClose: () => void;
  userRole?: string;
}

const categoryColors: Record<string, string> = {
  marketing: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  content: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  education: 'bg-green-500/10 text-green-600 border-green-500/20',
  engage: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  system: 'bg-red-500/10 text-red-600 border-red-500/20',
  internal: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
};

// Template preview thumbnails (simplified representations)
const templatePreviews: Record<string, React.ReactNode> = {
  'hero-with-cta': (
    <div className="space-y-1">
      <div className="h-8 bg-primary/20 rounded flex items-center justify-center">
        <div className="w-16 h-2 bg-primary/40 rounded" />
      </div>
      <div className="h-2 w-3/4 mx-auto bg-muted-foreground/20 rounded" />
      <div className="h-4 w-12 mx-auto bg-primary/40 rounded" />
    </div>
  ),
  'feature-showcase': (
    <div className="space-y-1">
      <div className="h-3 w-1/2 mx-auto bg-muted-foreground/30 rounded" />
      <div className="grid grid-cols-3 gap-1">
        <div className="h-6 bg-muted-foreground/20 rounded" />
        <div className="h-6 bg-muted-foreground/20 rounded" />
        <div className="h-6 bg-muted-foreground/20 rounded" />
      </div>
    </div>
  ),
  'blog-post-starter': (
    <div className="space-y-1">
      <div className="h-3 w-3/4 bg-muted-foreground/30 rounded" />
      <div className="h-1.5 w-full bg-muted-foreground/15 rounded" />
      <div className="h-1.5 w-full bg-muted-foreground/15 rounded" />
      <div className="h-1.5 w-2/3 bg-muted-foreground/15 rounded" />
    </div>
  ),
  'testimonial-carousel': (
    <div className="space-y-1">
      <div className="h-4 bg-muted-foreground/20 rounded p-1">
        <div className="h-full bg-muted-foreground/20 rounded" />
      </div>
      <div className="flex justify-center gap-0.5">
        <div className="w-1 h-1 bg-primary/40 rounded-full" />
        <div className="w-1 h-1 bg-muted-foreground/20 rounded-full" />
        <div className="w-1 h-1 bg-muted-foreground/20 rounded-full" />
      </div>
    </div>
  ),
};

const DefaultPreview = () => (
  <div className="space-y-1">
    <div className="h-2 w-2/3 bg-muted-foreground/20 rounded" />
    <div className="h-1.5 w-full bg-muted-foreground/15 rounded" />
    <div className="h-1.5 w-4/5 bg-muted-foreground/15 rounded" />
    <div className="h-3 w-10 bg-primary/30 rounded mt-1" />
  </div>
);

export const CMSTemplatePanel = ({
  onInsertTemplate,
  onClose,
  userRole = 'tenant_admin',
}: CMSTemplatePanelProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const filteredTemplates = searchTemplates(searchQuery, activeCategory, userRole);

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <LayoutGrid size={18} />
            <h3 className="font-semibold text-sm sm:text-base">Block Templates</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Category Tabs - Scrollable on mobile */}
        <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {templateCategories
            .filter(cat => cat.id !== 'internal' || userRole === 'tenant_admin')
            .map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  'px-2.5 py-1.5 text-xs sm:text-sm rounded-lg transition-colors whitespace-nowrap flex-shrink-0',
                  activeCategory === category.id
                    ? 'bg-foreground text-background font-medium'
                    : 'text-muted-foreground hover:bg-muted'
                )}
              >
                {category.label}
              </button>
            ))}
        </div>
      </div>

      {/* Template List */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No templates found
          </div>
        ) : (
          filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.015 }}
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
              onClick={() => onInsertTemplate(template)}
              className="relative p-3 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="flex gap-3">
                {/* Template Thumbnail */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-muted/50 border border-border p-2 flex-shrink-0 overflow-hidden">
                  {templatePreviews[template.id] || <DefaultPreview />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-medium text-sm truncate">{template.name}</h4>
                    <span
                      className={cn(
                        'px-1.5 py-0.5 text-[10px] rounded-full border capitalize flex-shrink-0',
                        categoryColors[template.category] || 'bg-muted text-muted-foreground'
                      )}
                    >
                      {template.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {template.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 text-[10px] text-muted-foreground bg-muted rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hover Preview Indicator */}
              <AnimatePresence>
                {hoveredTemplate === template.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground rounded-md text-xs"
                  >
                    <Eye size={12} />
                    Click to insert
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border text-center text-xs text-muted-foreground">
        {filteredTemplates.length} templates available
      </div>
    </div>
  );
};
