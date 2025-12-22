import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  RotateCcw, 
  Eye, 
  ChevronDown,
  User,
  GitBranch
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Version {
  id: string;
  timestamp: Date;
  author: string;
  authorInitials: string;
  changes: string;
  blocksChanged: number;
  isCurrent: boolean;
}

const dummyVersions: Version[] = [
  {
    id: 'v8',
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    author: 'You',
    authorInitials: 'YO',
    changes: 'Updated hero section',
    blocksChanged: 2,
    isCurrent: true,
  },
  {
    id: 'v7',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    author: 'You',
    authorInitials: 'YO',
    changes: 'Added testimonial block',
    blocksChanged: 1,
    isCurrent: false,
  },
  {
    id: 'v6',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    author: 'Sarah Chen',
    authorInitials: 'SC',
    changes: 'Revised introduction text',
    blocksChanged: 3,
    isCurrent: false,
  },
  {
    id: 'v5',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    author: 'You',
    authorInitials: 'YO',
    changes: 'Added feature grid',
    blocksChanged: 1,
    isCurrent: false,
  },
  {
    id: 'v4',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    author: 'John Smith',
    authorInitials: 'JS',
    changes: 'Initial content structure',
    blocksChanged: 8,
    isCurrent: false,
  },
];

interface CMSVersionHistoryProps {
  contentId: string | null;
  onRestore: (versionId: string) => void;
  onPreview: (versionId: string) => void;
}

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export const CMSVersionHistory = ({ contentId, onRestore, onPreview }: CMSVersionHistoryProps) => {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [compareWith, setCompareWith] = useState<string | null>(null);

  if (!contentId) {
    return (
      <div className="p-6 text-center text-sm text-muted-foreground">
        Select content to view history
      </div>
    );
  }

  const handleVersionClick = (versionId: string) => {
    if (isComparing) {
      if (selectedVersion === versionId) {
        setSelectedVersion(null);
      } else if (compareWith === versionId) {
        setCompareWith(null);
      } else if (!selectedVersion) {
        setSelectedVersion(versionId);
      } else {
        setCompareWith(versionId);
      }
    } else {
      setSelectedVersion(selectedVersion === versionId ? null : versionId);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-muted-foreground" />
            <h3 className="text-sm font-semibold">Version History</h3>
          </div>
          <span className="text-xs text-muted-foreground">
            {dummyVersions.length} versions
          </span>
        </div>
        
        {/* Compare toggle */}
        <button
          onClick={() => {
            setIsComparing(!isComparing);
            setSelectedVersion(null);
            setCompareWith(null);
          }}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-2 text-xs rounded-md transition-colors',
            isComparing
              ? 'bg-primary/10 text-primary border border-primary/30'
              : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
          )}
        >
          <GitBranch size={12} />
          {isComparing ? 'Exit Compare Mode' : 'Compare Versions'}
        </button>
        
        {isComparing && selectedVersion && (
          <div className="mt-2 text-xs text-muted-foreground text-center">
            {compareWith 
              ? 'Comparing selected versions' 
              : 'Select another version to compare'}
          </div>
        )}
      </div>

      {/* Version List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {dummyVersions.map((version, index) => (
            <motion.div
              key={version.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <button
                onClick={() => handleVersionClick(version.id)}
                className={cn(
                  'w-full text-left p-3 rounded-lg transition-all',
                  version.isCurrent && 'border-l-2 border-l-primary',
                  selectedVersion === version.id || compareWith === version.id
                    ? 'bg-primary/10 ring-1 ring-primary/30'
                    : 'hover:bg-secondary/50'
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0',
                    version.author === 'You' 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-secondary text-muted-foreground'
                  )}>
                    {version.authorInitials}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium truncate">
                        {version.changes}
                      </span>
                      {version.isCurrent && (
                        <span className="px-1.5 py-0.5 text-[9px] rounded bg-primary/10 text-primary flex-shrink-0">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{version.author}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(version.timestamp)}</span>
                      <span>•</span>
                      <span>{version.blocksChanged} block{version.blocksChanged > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              </button>
              
              {/* Actions (when selected) */}
              <AnimatePresence>
                {selectedVersion === version.id && !isComparing && !version.isCurrent && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex gap-2 px-3 pb-2 pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-8 text-xs gap-1.5"
                        onClick={() => onPreview(version.id)}
                      >
                        <Eye size={12} />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 h-8 text-xs gap-1.5"
                        onClick={() => onRestore(version.id)}
                      >
                        <RotateCcw size={12} />
                        Restore
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Compare Action */}
      {isComparing && selectedVersion && compareWith && (
        <div className="p-3 border-t border-border">
          <Button className="w-full gap-2" size="sm">
            <GitBranch size={14} />
            Compare Selected
          </Button>
        </div>
      )}
    </div>
  );
};
