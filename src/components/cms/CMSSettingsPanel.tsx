import { useState } from 'react';
import { 
  Link2, 
  Tag, 
  Globe, 
  Users, 
  Lock,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CMSSettingsPanelProps {
  contentId: string;
}

export const CMSSettingsPanel = ({ contentId }: CMSSettingsPanelProps) => {
  const [visibility, setVisibility] = useState<'public' | 'members' | 'private'>('public');

  return (
    <div className="space-y-8">
      {/* Metadata Section */}
      <div>
        <h3 className="text-sm font-medium mb-4">Metadata</h3>
        <div className="space-y-4">
          {/* Slug */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">URL Slug</label>
            <div className="flex items-center gap-2">
              <Link2 size={16} className="text-muted-foreground" />
              <input
                type="text"
                defaultValue="getting-started-guide"
                className="flex-1 h-10 px-3 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Content Type */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Content Type</label>
            <select className="w-full h-10 px-3 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>Article</option>
              <option>Documentation</option>
              <option>Lesson</option>
              <option>Announcement</option>
              <option>Email Template</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Tags</label>
            <div className="flex flex-wrap gap-2">
              {['guide', 'tutorial', 'getting-started'].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-muted rounded-lg border border-border"
                >
                  <Tag size={12} className="text-muted-foreground" />
                  {tag}
                </span>
              ))}
              <button className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                + Add tag
              </button>
            </div>
          </div>

          {/* Last Updated */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock size={14} />
            <span>Last updated 2 hours ago</span>
          </div>
        </div>
      </div>

      {/* Visibility Section */}
      <div>
        <h3 className="text-sm font-medium mb-4">Visibility</h3>
        <div className="space-y-2">
          {[
            { id: 'public' as const, label: 'Public', description: 'Visible to everyone', icon: Globe },
            { id: 'members' as const, label: 'Members Only', description: 'Only logged-in users', icon: Users },
            { id: 'private' as const, label: 'Private', description: 'Only you can see', icon: Lock },
          ].map(({ id, label, description, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setVisibility(id)}
              className={cn(
                'w-full flex items-center gap-4 p-4 rounded-xl border transition-colors text-left',
                visibility === id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/30'
              )}
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  visibility === id ? 'bg-primary/10' : 'bg-muted'
                )}
              >
                <Icon
                  size={18}
                  className={visibility === id ? 'text-primary' : 'text-muted-foreground'}
                />
              </div>
              <div>
                <div className="font-medium">{label}</div>
                <div className="text-sm text-muted-foreground">{description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* SEO Section */}
      <div>
        <h3 className="text-sm font-medium mb-4">SEO Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Meta Title</label>
            <input
              type="text"
              placeholder="Enter meta title..."
              defaultValue="Getting Started Guide - Zenith Studio"
              className="w-full h-10 px-3 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Meta Description</label>
            <textarea
              placeholder="Enter meta description..."
              defaultValue="Learn how to get started with Zenith Studio in this comprehensive guide."
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
