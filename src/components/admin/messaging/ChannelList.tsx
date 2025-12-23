import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Hash,
  Lock,
  Plus,
  Users,
  MessageSquare,
  Search,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export interface Channel {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private' | 'direct';
  unreadCount?: number;
  lastMessage?: string;
  lastMessageTime?: string;
  members?: { id: string; name: string; avatar?: string }[];
}

interface ChannelListProps {
  channels: Channel[];
  directMessages: Channel[];
  selectedChannelId?: string;
  onSelectChannel: (channel: Channel) => void;
  onCreateChannel: () => void;
  onStartDM: () => void;
}

export const ChannelList = ({
  channels,
  directMessages,
  selectedChannelId,
  onSelectChannel,
  onCreateChannel,
  onStartDM,
}: ChannelListProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChannels = channels.filter((ch) =>
    ch.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDMs = directMessages.filter((dm) =>
    dm.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="h-full flex flex-col border-r border-border bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">Messages</h3>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings size={16} />
          </Button>
        </div>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {/* Channels Section */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Channels
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={onCreateChannel}
            >
              <Plus size={14} />
            </Button>
          </div>

          <div className="space-y-1">
            {filteredChannels.map((channel) => (
              <motion.button
                key={channel.id}
                whileHover={{ x: 2 }}
                onClick={() => onSelectChannel(channel)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors ${
                  selectedChannelId === channel.id
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-accent/50'
                }`}
              >
                {channel.type === 'private' ? (
                  <Lock size={16} className="text-muted-foreground flex-shrink-0" />
                ) : (
                  <Hash size={16} className="text-muted-foreground flex-shrink-0" />
                )}
                <span className="flex-1 text-sm font-medium truncate">
                  {channel.name}
                </span>
                {channel.unreadCount && channel.unreadCount > 0 && (
                  <Badge variant="destructive" className="h-5 min-w-[20px] px-1.5">
                    {channel.unreadCount}
                  </Badge>
                )}
              </motion.button>
            ))}

            {filteredChannels.length === 0 && (
              <p className="text-xs text-muted-foreground py-2 text-center">
                No channels found
              </p>
            )}
          </div>
        </div>

        {/* Direct Messages Section */}
        <div className="p-3 pt-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Direct Messages
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={onStartDM}
            >
              <Plus size={14} />
            </Button>
          </div>

          <div className="space-y-1">
            {filteredDMs.map((dm) => (
              <motion.button
                key={dm.id}
                whileHover={{ x: 2 }}
                onClick={() => onSelectChannel(dm)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors ${
                  selectedChannelId === dm.id
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-accent/50'
                }`}
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={dm.members?.[0]?.avatar} />
                  <AvatarFallback className="text-xs">
                    {getInitials(dm.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{dm.name}</p>
                  {dm.lastMessage && (
                    <p className="text-xs text-muted-foreground truncate">
                      {dm.lastMessage}
                    </p>
                  )}
                </div>
                {dm.unreadCount && dm.unreadCount > 0 && (
                  <Badge variant="destructive" className="h-5 min-w-[20px] px-1.5">
                    {dm.unreadCount}
                  </Badge>
                )}
              </motion.button>
            ))}

            {filteredDMs.length === 0 && (
              <p className="text-xs text-muted-foreground py-2 text-center">
                No direct messages
              </p>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
