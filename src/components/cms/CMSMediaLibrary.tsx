import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Upload,
  Image as ImageIcon,
  Grid3X3,
  List,
  FolderOpen,
  X,
  Check,
  Trash2,
  Download,
  MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: string;
  dimensions?: string;
  uploadedAt: string;
  folder?: string;
}

const mockMedia: MediaItem[] = [
  { id: '1', name: 'hero-banner.jpg', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', type: 'image', size: '1.2 MB', dimensions: '1920x1080', uploadedAt: '2024-01-15', folder: 'Marketing' },
  { id: '2', name: 'team-photo.png', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400', type: 'image', size: '800 KB', dimensions: '1200x800', uploadedAt: '2024-01-14', folder: 'Team' },
  { id: '3', name: 'product-shot.jpg', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', type: 'image', size: '650 KB', dimensions: '800x800', uploadedAt: '2024-01-13', folder: 'Products' },
  { id: '4', name: 'office-view.jpg', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400', type: 'image', size: '1.5 MB', dimensions: '1920x1280', uploadedAt: '2024-01-12', folder: 'Marketing' },
  { id: '5', name: 'abstract-bg.png', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400', type: 'image', size: '400 KB', dimensions: '1600x900', uploadedAt: '2024-01-11', folder: 'Backgrounds' },
  { id: '6', name: 'laptop-work.jpg', url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', type: 'image', size: '720 KB', dimensions: '1200x800', uploadedAt: '2024-01-10', folder: 'Marketing' },
];

const folders = ['All', 'Marketing', 'Products', 'Team', 'Backgrounds'];

interface CMSMediaLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia?: (media: MediaItem) => void;
  selectionMode?: boolean;
}

export const CMSMediaLibrary = ({
  isOpen,
  onClose,
  onSelectMedia,
  selectionMode = false,
}: CMSMediaLibraryProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFolder, setActiveFolder] = useState('All');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredMedia = mockMedia.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = activeFolder === 'All' || item.folder === activeFolder;
    return matchesSearch && matchesFolder;
  });

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      toast.success(`${files.length} file(s) uploaded`, {
        description: 'Files are being processed...',
      });
    }
  };

  const handleSelect = (id: string) => {
    if (selectionMode && onSelectMedia) {
      const media = mockMedia.find((m) => m.id === id);
      if (media) {
        onSelectMedia(media);
        onClose();
      }
    } else {
      setSelectedItems((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    }
  };

  const handleDelete = () => {
    if (selectedItems.length > 0) {
      toast.success(`${selectedItems.length} item(s) deleted`);
      setSelectedItems([]);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-5xl h-[80vh] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ImageIcon size={20} />
            <h2 className="font-semibold text-lg">Media Library</h2>
            <span className="text-sm text-muted-foreground">
              {filteredMedia.length} items
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleUpload} size="sm" className="gap-2">
              <Upload size={14} />
              Upload
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-border flex items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-lg bg-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Folders */}
          <div className="flex items-center gap-1">
            {folders.map((folder) => (
              <button
                key={folder}
                onClick={() => setActiveFolder(folder)}
                className={cn(
                  'px-3 py-1.5 text-sm rounded-lg transition-colors',
                  activeFolder === folder
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                )}
              >
                {folder}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'grid'
                  ? 'bg-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Grid3X3 size={14} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'list'
                  ? 'bg-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <List size={14} />
            </button>
          </div>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedItems.length} selected
              </span>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Download size={14} />
                Download
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="gap-1.5"
                onClick={handleDelete}
              >
                <Trash2 size={14} />
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredMedia.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    'relative group rounded-xl overflow-hidden border-2 transition-all cursor-pointer',
                    selectedItems.includes(item.id)
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/30'
                  )}
                  onClick={() => handleSelect(item.id)}
                >
                  <div className="aspect-square bg-muted">
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Selection Indicator */}
                  <div
                    className={cn(
                      'absolute top-2 left-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
                      selectedItems.includes(item.id)
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'bg-background/80 border-border opacity-0 group-hover:opacity-100'
                    )}
                  >
                    {selectedItems.includes(item.id) && <Check size={14} />}
                  </div>

                  {/* Info Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-medium truncate">
                      {item.name}
                    </p>
                    <p className="text-white/70 text-xs">{item.size}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={cn(
                    'flex items-center gap-4 p-3 rounded-xl border transition-all cursor-pointer',
                    selectedItems.includes(item.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/30'
                  )}
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.size} • {item.dimensions} • {item.folder}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.uploadedAt}
                  </div>
                  <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {selectionMode && (
          <div className="p-4 border-t border-border flex items-center justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={selectedItems.length === 0}>
              Select Media
            </Button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
