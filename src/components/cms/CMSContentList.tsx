import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  FileText,
  Send,
  File,
  Calendar,
  LayoutGrid,
  Pencil,
  Eye,
  Trash2,
  User,
  CalendarDays,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ContentItem {
  id: string;
  title: string;
  type: string;
  author: string;
  date: string;
  blocks: number;
  status: 'draft' | 'published' | 'scheduled';
  tags: string[];
}

interface CMSContentListProps {
  onSelectContent: (id: string) => void;
  onNewContent: () => void;
}

const mockContent: ContentItem[] = [
  {
    id: '1',
    title: 'Homepage',
    type: 'website page',
    author: 'Admin',
    date: '15/01/2024',
    blocks: 5,
    status: 'published',
    tags: [],
  },
  {
    id: '2',
    title: '10 Tips for Effective Online Learning',
    type: 'blog post',
    author: 'Sarah Johnson',
    date: '20/01/2024',
    blocks: 7,
    status: 'published',
    tags: ['public share'],
  },
  {
    id: '3',
    title: 'JavaScript Variables Lesson',
    type: 'lms lesson',
    author: 'Mike Chen',
    date: '22/01/2024',
    blocks: 6,
    status: 'draft',
    tags: [],
  },
  {
    id: '4',
    title: 'Weekly Newsletter Template',
    type: 'email template',
    author: 'Unknown',
    date: '25/01/2024',
    blocks: 2,
    status: 'scheduled',
    tags: ['automation input'],
  },
  {
    id: '5',
    title: 'Course Announcement',
    type: 'announcement',
    author: 'Unknown',
    date: '28/01/2024',
    blocks: 3,
    status: 'published',
    tags: ['email template'],
  },
];

const stats = [
  { label: 'Total Content', value: 5, icon: LayoutGrid },
  { label: 'Published', value: 3, icon: Send },
  { label: 'Drafts', value: 1, icon: File },
  { label: 'Scheduled', value: 1, icon: Calendar },
];

export const CMSContentList = ({ onSelectContent, onNewContent }: CMSContentListProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContent = mockContent.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'draft':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'scheduled':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <FileText size={20} className="text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">CMS Studio</h1>
              <p className="text-sm text-muted-foreground">Content Operating System</p>
            </div>
          </div>
          <Button onClick={onNewContent} className="gap-2">
            <Plus size={16} />
            New Content
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-xl border border-border bg-card"
            >
              <stat.icon size={18} className="text-muted-foreground mb-2" />
              <div className="text-2xl font-semibold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-80 mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-card border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Content List */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="space-y-2">
          {filteredContent.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors cursor-pointer group"
              onClick={() => onSelectContent(item.id)}
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <FileText size={18} className="text-muted-foreground" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{item.title}</h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1">
                    <User size={12} />
                    {item.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays size={12} />
                    {item.date}
                  </span>
                  <span>{item.blocks} blocks</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 text-xs rounded-full border border-border bg-muted">
                  {item.type}
                </span>
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs rounded-full border border-border bg-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Status Badge */}
              <span
                className={cn(
                  'px-3 py-1 text-xs font-medium rounded-full border capitalize',
                  getStatusBadge(item.status)
                )}
              >
                {item.status}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <Pencil size={16} className="text-muted-foreground" />
                </button>
                <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <Eye size={16} className="text-muted-foreground" />
                </button>
                <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <Trash2 size={16} className="text-muted-foreground" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
