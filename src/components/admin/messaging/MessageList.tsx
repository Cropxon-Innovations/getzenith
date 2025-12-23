import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Download, File, Image as ImageIcon } from 'lucide-react';

export interface Message {
  id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'file' | 'image';
  attachments: { name: string; url: string; type: string; size: number }[];
  created_at: string;
  sender?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export const MessageList = ({ messages, currentUserId }: MessageListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
      <AnimatePresence>
        {messages.map((message, index) => {
          const isOwn = message.sender_id === currentUserId;
          const showAvatar =
            index === 0 || messages[index - 1].sender_id !== message.sender_id;

          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
            >
              {showAvatar ? (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={message.sender?.avatar_url} />
                  <AvatarFallback className="text-xs">
                    {message.sender?.full_name
                      ? getInitials(message.sender.full_name)
                      : '?'}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="w-8" />
              )}

              <div
                className={`max-w-[70%] ${
                  isOwn ? 'items-end' : 'items-start'
                }`}
              >
                {showAvatar && (
                  <div
                    className={`flex items-center gap-2 mb-1 ${
                      isOwn ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <span className="text-xs font-medium text-foreground">
                      {message.sender?.full_name || 'Unknown'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(message.created_at), 'HH:mm')}
                    </span>
                  </div>
                )}

                <div
                  className={`rounded-2xl px-4 py-2 ${
                    isOwn
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-muted rounded-tl-sm'
                  }`}
                >
                  {message.message_type === 'text' && (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  )}

                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-2 p-2 rounded-lg ${
                            isOwn ? 'bg-primary-foreground/10' : 'bg-background/50'
                          }`}
                        >
                          {attachment.type.startsWith('image/') ? (
                            <ImageIcon size={16} />
                          ) : (
                            <File size={16} />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">
                              {attachment.name}
                            </p>
                            <p className="text-xs opacity-70">
                              {formatFileSize(attachment.size)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            asChild
                          >
                            <a
                              href={attachment.url}
                              download={attachment.name}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download size={12} />
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <p className="text-sm">No messages yet. Start the conversation!</p>
        </div>
      )}
    </div>
  );
};
