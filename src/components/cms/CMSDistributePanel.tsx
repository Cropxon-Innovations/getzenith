import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  Mail,
  GraduationCap,
  Zap,
  Link2,
  Copy,
  Check,
  Lock,
  Users,
  Eye,
  ExternalLink,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type AccessLevel = 'public' | 'members' | 'private';

interface Channel {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
  connected: boolean;
}

interface CMSDistributePanelProps {
  contentId: string;
  status: 'draft' | 'published' | 'scheduled';
  slug?: string;
}

export const CMSDistributePanel = ({ contentId, status, slug = 'content' }: CMSDistributePanelProps) => {
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('public');
  const [copied, setCopied] = useState(false);

  const isPublished = status === 'published';
  const publicUrl = `https://yoursite.com/${slug}`;

  const channels: Channel[] = [
    {
      id: 'website',
      name: 'Website',
      description: 'Publish to your website as a page or post',
      icon: Globe,
      enabled: true,
      connected: true,
    },
    {
      id: 'email',
      name: 'Email Campaign',
      description: 'Use this content in email marketing',
      icon: Mail,
      enabled: true,
      connected: false,
    },
    {
      id: 'lms',
      name: 'LMS Course',
      description: 'Attach as lesson or module content',
      icon: GraduationCap,
      enabled: true,
      connected: false,
    },
    {
      id: 'automation',
      name: 'Automation',
      description: 'Use as message payload in workflows',
      icon: Zap,
      enabled: false,
      connected: false,
    },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success('Link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const accessOptions = [
    { id: 'public' as AccessLevel, label: 'Public', description: 'Anyone can view', icon: Globe },
    { id: 'members' as AccessLevel, label: 'Members Only', description: 'Logged-in users', icon: Users },
    { id: 'private' as AccessLevel, label: 'Private', description: 'Only you', icon: Lock },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header Status */}
      {!isPublished && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl border border-orange-500/20 bg-orange-500/5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Eye size={20} className="text-orange-500" />
            </div>
            <div>
              <h3 className="font-medium text-orange-600">Content not published</h3>
              <p className="text-sm text-muted-foreground">
                Publish this content first to enable distribution channels.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Public URL Section */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">PUBLIC URL</h3>
        <div className={cn(
          'flex items-center gap-2 p-3 rounded-xl border',
          isPublished ? 'border-border bg-card' : 'border-border/50 bg-muted/30 opacity-60'
        )}>
          <Link2 size={18} className="text-muted-foreground flex-shrink-0" />
          <span className="flex-1 text-sm truncate font-mono">{publicUrl}</span>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 flex-shrink-0"
            onClick={handleCopyLink}
            disabled={!isPublished}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          {isPublished && (
            <Button variant="outline" size="sm" className="gap-2 flex-shrink-0" asChild>
              <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={14} />
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Access Level */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">ACCESS LEVEL</h3>
        <div className="grid grid-cols-3 gap-3">
          {accessOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => setAccessLevel(option.id)}
                disabled={!isPublished}
                className={cn(
                  'p-4 rounded-xl border text-left transition-all',
                  accessLevel === option.id
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                    : 'border-border hover:border-primary/30',
                  !isPublished && 'opacity-50 cursor-not-allowed'
                )}
              >
                <Icon size={20} className={cn(
                  'mb-2',
                  accessLevel === option.id ? 'text-primary' : 'text-muted-foreground'
                )} />
                <p className="font-medium text-sm">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Distribution Channels */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">DISTRIBUTION CHANNELS</h3>
        <div className="space-y-3">
          {channels.map((channel, index) => {
            const Icon = channel.icon;
            return (
              <motion.div
                key={channel.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-xl border transition-all',
                  channel.enabled && isPublished
                    ? 'border-border bg-card hover:border-primary/30 cursor-pointer'
                    : 'border-border/50 bg-muted/20 opacity-60'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  channel.connected ? 'bg-primary/10' : 'bg-muted'
                )}>
                  <Icon size={20} className={channel.connected ? 'text-primary' : 'text-muted-foreground'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{channel.name}</p>
                    {channel.connected && (
                      <span className="px-1.5 py-0.5 text-[10px] rounded bg-green-500/10 text-green-600">
                        Connected
                      </span>
                    )}
                    {!channel.enabled && (
                      <span className="px-1.5 py-0.5 text-[10px] rounded bg-muted text-muted-foreground">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{channel.description}</p>
                </div>
                {channel.enabled && channel.connected ? (
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings size={14} />
                    Configure
                  </Button>
                ) : channel.enabled ? (
                  <Button variant="outline" size="sm" disabled={!isPublished}>
                    Connect
                  </Button>
                ) : null}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Pro tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 p-4 rounded-xl bg-muted/30 border border-border"
      >
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Pro tip:</span> Connect your email and automation channels 
          to automatically distribute content when published.
        </p>
      </motion.div>
    </div>
  );
};
