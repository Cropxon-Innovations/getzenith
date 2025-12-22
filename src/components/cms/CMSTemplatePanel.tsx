import { useState } from 'react';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  BlockTemplate,
  templateCategories,
  searchTemplates,
  TemplateCategory,
} from './templates/templateLibrary';

interface CMSTemplatePanelProps {
  onInsertTemplate: (template: BlockTemplate) => void;
  onClose: () => void;
  userRole?: string;
}

const categoryIcons: Record<string, React.ElementType> = {
  all: LayoutGrid,
  marketing: Layout,
  content: FileText,
  education: BookOpen,
  engage: Mail,
  system: Zap,
  internal: Building2,
};

const categoryColors: Record<string, string> = {
  marketing: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  content: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  education: 'bg-green-500/10 text-green-600 border-green-500/20',
  engage: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  system: 'bg-red-500/10 text-red-600 border-red-500/20',
  internal: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
};

export const CMSTemplatePanel = ({
  onInsertTemplate,
  onClose,
  userRole = 'tenant_admin',
}: CMSTemplatePanelProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredTemplates = searchTemplates(searchQuery, activeCategory, userRole);

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <LayoutGrid size={18} />
            <h3 className="font-semibold">Block Templates</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-lg bg-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1">
          {templateCategories
            .filter(cat => cat.id !== 'internal' || userRole === 'tenant_admin')
            .map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  'px-3 py-1.5 text-sm rounded-lg transition-colors',
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
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
              transition={{ delay: index * 0.02 }}
              onClick={() => onInsertTemplate(template)}
              className="p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer group"
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                  <Layout size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium truncate">{template.name}</h4>
                    <span
                      className={cn(
                        'px-2 py-0.5 text-xs rounded-full border capitalize',
                        categoryColors[template.category] || 'bg-muted text-muted-foreground'
                      )}
                    >
                      {template.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {template.description}
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {template.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs text-muted-foreground bg-muted rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border text-center text-xs text-muted-foreground">
        {filteredTemplates.length} templates available
      </div>
    </div>
  );
};
