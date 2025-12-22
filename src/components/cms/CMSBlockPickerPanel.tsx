import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Type,
  Image,
  List,
  Quote,
  Minus,
  Code,
  Table,
  Video,
  FileText,
  Layout,
  MousePointer,
  Grid3X3,
  MessageSquareQuote,
  DollarSign,
  BookOpen,
  HelpCircle,
  GraduationCap,
  Zap,
  Database,
  Lock,
  GripVertical,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  ChevronDown,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlockDefinition {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: 'core' | 'advanced' | 'experience' | 'education' | 'system';
  adminOnly?: boolean;
  mentorOnly?: boolean;
}

const blocks: BlockDefinition[] = [
  // Core Blocks
  { id: 'header', name: 'Heading', description: 'Section title or headline', icon: Type, category: 'core' },
  { id: 'paragraph', name: 'Rich Text', description: 'Paragraph with formatting', icon: AlignLeft, category: 'core' },
  { id: 'image', name: 'Image', description: 'Upload or embed images', icon: Image, category: 'core' },
  { id: 'list', name: 'List', description: 'Bulleted or numbered list', icon: List, category: 'core' },
  { id: 'quote', name: 'Quote', description: 'Highlighted quotation', icon: Quote, category: 'core' },
  { id: 'delimiter', name: 'Divider', description: 'Visual section break', icon: Minus, category: 'core' },
  
  // Advanced Blocks
  { id: 'code', name: 'Code', description: 'Syntax-highlighted code', icon: Code, category: 'advanced' },
  { id: 'table', name: 'Table', description: 'Tabular data display', icon: Table, category: 'advanced' },
  { id: 'embed', name: 'Embed', description: 'YouTube, Vimeo, more', icon: Video, category: 'advanced' },
  { id: 'file', name: 'File', description: 'Downloadable attachment', icon: FileText, category: 'advanced' },
  
  // Experience Blocks
  { id: 'hero', name: 'Hero Section', description: 'Full-width banner', icon: Layout, category: 'experience' },
  { id: 'cta', name: 'CTA Block', description: 'Call-to-action section', icon: MousePointer, category: 'experience' },
  { id: 'featureGrid', name: 'Feature Grid', description: 'Multi-column features', icon: Grid3X3, category: 'experience' },
  { id: 'testimonial', name: 'Testimonial', description: 'Customer quote card', icon: MessageSquareQuote, category: 'experience' },
  { id: 'pricing', name: 'Pricing', description: 'Pricing table section', icon: DollarSign, category: 'experience', adminOnly: true },
  
  // Education Blocks
  { id: 'lessonContent', name: 'Lesson Content', description: 'Structured lesson block', icon: BookOpen, category: 'education' },
  { id: 'quiz', name: 'Quiz', description: 'Interactive assessment', icon: HelpCircle, category: 'education', mentorOnly: true },
  { id: 'courseReference', name: 'Course Reference', description: 'Link to course module', icon: GraduationCap, category: 'education' },
  
  // System Blocks
  { id: 'automationTrigger', name: 'Automation Trigger', description: 'Trigger workflow on view', icon: Zap, category: 'system', adminOnly: true },
  { id: 'dynamicData', name: 'Dynamic Data', description: 'Database-driven content', icon: Database, category: 'system', adminOnly: true },
];

const categories = [
  { id: 'core', label: 'Core Blocks', description: 'Essential content elements' },
  { id: 'advanced', label: 'Advanced Blocks', description: 'Rich media and data' },
  { id: 'experience', label: 'Experience Blocks', description: 'Marketing & landing pages' },
  { id: 'education', label: 'Education Blocks', description: 'Learning content' },
  { id: 'system', label: 'System Blocks', description: 'Automation & dynamic content' },
];

interface CMSBlockPickerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertBlock: (blockId: string) => void;
  userRole?: 'tenant_admin' | 'mentor' | 'content_editor' | 'student';
}

export const CMSBlockPickerPanel = ({ 
  isOpen, 
  onClose, 
  onInsertBlock,
  userRole = 'tenant_admin' 
}: CMSBlockPickerPanelProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    core: true,
    advanced: true,
    experience: true,
    education: true,
    system: true,
  });
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  const canAccessBlock = (block: BlockDefinition): boolean => {
    if (block.adminOnly && userRole !== 'tenant_admin') return false;
    if (block.mentorOnly && !['tenant_admin', 'mentor'].includes(userRole)) return false;
    return true;
  };

  const filteredBlocks = blocks.filter(block => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return block.name.toLowerCase().includes(query) || 
             block.description.toLowerCase().includes(query);
    }
    return true;
  });

  const getBlocksByCategory = (categoryId: string) => {
    return filteredBlocks.filter(block => block.category === categoryId);
  };

  const handleBlockClick = (block: BlockDefinition) => {
    if (!canAccessBlock(block)) return;
    onInsertBlock(block.id);
  };

  const handleDragStart = (e: React.DragEvent, block: BlockDefinition) => {
    if (!canAccessBlock(block)) {
      e.preventDefault();
      return;
    }
    setDraggedBlock(block.id);
    e.dataTransfer.setData('text/plain', block.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setDraggedBlock(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-80 h-full bg-card border-l border-border flex flex-col overflow-hidden z-20"
        >
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Add Block</h3>
              <button 
                onClick={onClose}
                className="p-1 rounded hover:bg-secondary transition-colors"
              >
                <X size={16} className="text-muted-foreground" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search blocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-8 pr-3 text-sm rounded-md bg-secondary/50 border border-border placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Block Categories */}
          <div className="flex-1 overflow-y-auto">
            {categories.map((category) => {
              const categoryBlocks = getBlocksByCategory(category.id);
              if (categoryBlocks.length === 0 && searchQuery) return null;

              return (
                <div key={category.id} className="border-b border-border last:border-b-0">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-secondary/30 transition-colors"
                  >
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {category.label}
                      </div>
                      {expandedCategories[category.id] && (
                        <div className="text-[10px] text-muted-foreground/70 mt-0.5">
                          {category.description}
                        </div>
                      )}
                    </div>
                    <ChevronDown 
                      size={14} 
                      className={cn(
                        'text-muted-foreground transition-transform',
                        expandedCategories[category.id] && 'rotate-180'
                      )} 
                    />
                  </button>

                  <AnimatePresence>
                    {expandedCategories[category.id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="overflow-hidden"
                      >
                        <div className="px-2 pb-2 space-y-1">
                          {categoryBlocks.map((block) => {
                            const hasAccess = canAccessBlock(block);
                            const Icon = block.icon;

                            return (
                              <motion.div
                                key={block.id}
                                draggable={hasAccess}
                                onDragStart={(e) => handleDragStart(e as any, block)}
                                onDragEnd={handleDragEnd}
                                onClick={() => handleBlockClick(block)}
                                whileHover={hasAccess ? { scale: 1.01 } : {}}
                                whileTap={hasAccess ? { scale: 0.99 } : {}}
                                className={cn(
                                  'flex items-center gap-3 p-2.5 rounded-lg transition-all group',
                                  hasAccess 
                                    ? 'cursor-pointer hover:bg-secondary/70 active:bg-secondary' 
                                    : 'opacity-50 cursor-not-allowed',
                                  draggedBlock === block.id && 'ring-2 ring-primary bg-primary/5'
                                )}
                              >
                                {/* Drag Handle */}
                                {hasAccess && (
                                  <GripVertical 
                                    size={12} 
                                    className="text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" 
                                  />
                                )}

                                {/* Icon */}
                                <div className={cn(
                                  'w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0',
                                  hasAccess 
                                    ? 'bg-secondary group-hover:bg-primary/10 group-hover:text-primary' 
                                    : 'bg-secondary/50'
                                )}>
                                  <Icon size={16} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-medium truncate">{block.name}</span>
                                    {!hasAccess && (
                                      <Lock size={10} className="text-muted-foreground flex-shrink-0" />
                                    )}
                                  </div>
                                  <p className="text-[11px] text-muted-foreground truncate">
                                    {block.description}
                                  </p>
                                </div>

                                {/* Admin badge */}
                                {(block.adminOnly || block.mentorOnly) && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground flex-shrink-0">
                                    {block.adminOnly ? 'Admin' : 'Mentor+'}
                                  </span>
                                )}
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Typography Controls */}
          <div className="border-t border-border">
            <div className="p-3">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
                Typography
              </div>

              {/* Font Family */}
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-muted-foreground mb-1 block">Font Family</label>
                  <select className="w-full text-xs bg-secondary/50 border border-border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/50">
                    <option>Inter (System)</option>
                    <option>Playfair Display</option>
                    <option>Source Serif Pro</option>
                    <option>DM Sans</option>
                  </select>
                </div>

                {/* Heading Scale */}
                <div>
                  <label className="text-[10px] text-muted-foreground mb-1 block">Heading Scale</label>
                  <div className="flex gap-1">
                    {['Default', 'Large', 'Compact'].map((scale) => (
                      <button
                        key={scale}
                        className={cn(
                          'flex-1 py-1.5 text-[10px] rounded transition-colors',
                          scale === 'Default' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-secondary/50 hover:bg-secondary'
                        )}
                      >
                        {scale}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Alignment */}
                <div>
                  <label className="text-[10px] text-muted-foreground mb-1 block">Text Alignment</label>
                  <div className="flex gap-1">
                    {[
                      { icon: AlignLeft, value: 'left' },
                      { icon: AlignCenter, value: 'center' },
                      { icon: AlignRight, value: 'right' },
                    ].map(({ icon: Icon, value }) => (
                      <button
                        key={value}
                        className={cn(
                          'flex-1 py-2 rounded flex items-center justify-center transition-colors',
                          value === 'left' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-secondary/50 hover:bg-secondary'
                        )}
                      >
                        <Icon size={14} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Emphasis */}
                <div>
                  <label className="text-[10px] text-muted-foreground mb-1 block">Emphasis</label>
                  <div className="flex gap-1">
                    <button className="flex-1 py-1.5 text-xs rounded bg-secondary/50 hover:bg-secondary transition-colors font-bold">
                      Bold
                    </button>
                    <button className="flex-1 py-1.5 text-xs rounded bg-secondary/50 hover:bg-secondary transition-colors text-primary">
                      Accent
                    </button>
                    <button className="flex-1 py-1.5 text-xs rounded bg-secondary/50 hover:bg-secondary transition-colors">
                      <span className="bg-yellow-500/30 px-1 rounded">Mark</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
