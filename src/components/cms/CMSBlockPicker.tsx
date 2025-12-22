import { useState } from 'react';
import {
  Search,
  X,
  Type,
  AlignLeft,
  Image,
  List,
  Quote,
  Minus,
  Code,
  Globe,
  Layout,
  MousePointer,
  GraduationCap,
  MessageSquareQuote,
  Grid3X3,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlockItem {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
}

interface BlockCategory {
  id: string;
  label: string;
  blocks: BlockItem[];
}

const blockCategories: BlockCategory[] = [
  {
    id: 'basic',
    label: 'Basic Blocks',
    blocks: [
      { id: 'header', name: 'Heading', description: 'Section heading', icon: Type },
      { id: 'paragraph', name: 'Paragraph', description: 'Rich text paragraph', icon: AlignLeft },
      { id: 'image', name: 'Image', description: 'Image with caption', icon: Image },
      { id: 'list', name: 'List', description: 'Bulleted or numbered', icon: List },
      { id: 'quote', name: 'Quote', description: 'Blockquote with author', icon: Quote },
      { id: 'code', name: 'Code', description: 'Code block', icon: Code },
      { id: 'embed', name: 'Embed', description: 'Embed video or media', icon: Globe },
      { id: 'delimiter', name: 'Divider', description: 'Horizontal separator', icon: Minus },
    ],
  },
  {
    id: 'zenith',
    label: 'Zenith Blocks',
    blocks: [
      { id: 'hero', name: 'Hero Section', description: 'Full-width hero banner', icon: Layout },
      { id: 'cta', name: 'CTA Block', description: 'Call-to-action button', icon: MousePointer },
      { id: 'featureGrid', name: 'Feature Grid', description: 'Multi-column features', icon: Grid3X3 },
      { id: 'testimonial', name: 'Testimonial', description: 'Customer testimonial', icon: MessageSquareQuote },
      { id: 'lessonContent', name: 'Lesson Card', description: 'LMS lesson content', icon: GraduationCap },
      { id: 'quiz', name: 'Quiz Block', description: 'Interactive quiz', icon: HelpCircle },
    ],
  },
];

interface CMSBlockPickerProps {
  onInsertBlock: (blockId: string) => void;
  onClose: () => void;
}

export const CMSBlockPicker = ({ onInsertBlock, onClose }: CMSBlockPickerProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = blockCategories
    .map((category) => ({
      ...category,
      blocks: category.blocks.filter(
        (block) =>
          block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          block.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.blocks.length > 0);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Add Block</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search blocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-lg bg-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Block Categories */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredCategories.map((category) => (
          <div key={category.id} className="mb-6 last:mb-0">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              {category.label}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {category.blocks.map((block) => {
                const Icon = block.icon;
                return (
                  <button
                    key={block.id + block.name}
                    onClick={() => onInsertBlock(block.id)}
                    className="flex items-start gap-3 p-3 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-muted/50 transition-colors text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                      <Icon size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{block.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {block.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
