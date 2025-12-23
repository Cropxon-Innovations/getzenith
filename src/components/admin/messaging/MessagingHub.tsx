import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Video, Phone, MoreVertical, Users, Lock, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChannelList, Channel } from './ChannelList';
import { MessageList, Message } from './MessageList';
import { MessageInput } from './MessageInput';

export const MessagingHub = () => {
  const { user, tenant, profile } = useAuth();
  const { canAccessMessaging } = useRoleAccess();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [directMessages, setDirectMessages] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChannels = useCallback(async () => {
    if (!tenant) return;

    const { data, error } = await supabase
      .from('channels')
      .select('*')
      .eq('tenant_id', tenant.id);

    if (!error && data) {
      setChannels(
        data.map((ch) => ({
          id: ch.id,
          name: ch.name,
          description: ch.description || undefined,
          type: ch.type as 'public' | 'private',
        }))
      );
    }
    setIsLoading(false);
  }, [tenant]);

  const fetchMessages = useCallback(async () => {
    if (!selectedChannel || !tenant) return;

    const { data: messagesData, error } = await supabase
      .from('messages')
      .select('*')
      .eq('tenant_id', tenant.id)
      .eq('channel_id', selectedChannel.id)
      .order('created_at', { ascending: true })
      .limit(100);

    if (!error && messagesData) {
      // Fetch sender profiles separately
      const senderIds = [...new Set(messagesData.map(m => m.sender_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', senderIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      setMessages(
        messagesData.map((m) => ({
          id: m.id,
          sender_id: m.sender_id,
          content: m.content,
          message_type: (m.message_type as 'text' | 'file' | 'image') || 'text',
          attachments: (m.attachments as any[]) || [],
          created_at: m.created_at || new Date().toISOString(),
          sender: profileMap.get(m.sender_id)
            ? {
                id: profileMap.get(m.sender_id)!.id,
                full_name: profileMap.get(m.sender_id)!.full_name || 'Unknown',
                avatar_url: profileMap.get(m.sender_id)!.avatar_url || undefined,
              }
            : undefined,
        }))
      );
    }
  }, [selectedChannel, tenant]);

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Real-time subscription for messages
  useEffect(() => {
    if (!selectedChannel || !tenant) return;

    const channel = supabase
      .channel(`messages-${selectedChannel.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${selectedChannel.id}`,
        },
        async (payload) => {
          const newMessage = payload.new as any;
          
          // Fetch sender info
          const { data: sender } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .eq('id', newMessage.sender_id)
            .single();

          setMessages((prev) => [
            ...prev,
            {
              id: newMessage.id,
              sender_id: newMessage.sender_id,
              content: newMessage.content,
              message_type: newMessage.message_type || 'text',
              attachments: newMessage.attachments || [],
              created_at: newMessage.created_at,
              sender: sender
                ? {
                    id: sender.id,
                    full_name: sender.full_name || 'Unknown',
                    avatar_url: sender.avatar_url || undefined,
                  }
                : undefined,
            },
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedChannel, tenant]);

  const handleSendMessage = async (content: string, attachments: File[]) => {
    if (!user || !tenant || !selectedChannel) return;

    // TODO: Handle file uploads to storage
    const attachmentData: any[] = [];

    const { error } = await supabase.from('messages').insert({
      tenant_id: tenant.id,
      sender_id: user.id,
      channel_id: selectedChannel.id,
      content,
      message_type: attachments.length > 0 ? 'file' : 'text',
      attachments: attachmentData,
    });

    if (error) {
      console.error('Error sending message:', error);
    }
  };

  // Enterprise plan check
  if (!canAccessMessaging) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Crown size={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Enterprise Feature</h3>
            <p className="text-muted-foreground mb-4">
              The messaging hub is available exclusively for Enterprise plan subscribers.
              Upgrade to unlock real-time team communication, channels, and file sharing.
            </p>
            <Button>Upgrade to Enterprise</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex bg-background rounded-lg border border-border overflow-hidden">
      {/* Channel List */}
      <div className="w-64 flex-shrink-0">
        <ChannelList
          channels={channels}
          directMessages={directMessages}
          selectedChannelId={selectedChannel?.id}
          onSelectChannel={setSelectedChannel}
          onCreateChannel={() => {}}
          onStartDM={() => {}}
        />
      </div>

      {/* Message Area */}
      <div className="flex-1 flex flex-col">
        {selectedChannel ? (
          <>
            {/* Channel Header */}
            <div className="h-14 px-4 flex items-center justify-between border-b border-border bg-card">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                  {selectedChannel.type === 'private' ? (
                    <Lock size={16} className="text-primary" />
                  ) : (
                    <Users size={16} className="text-primary" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{selectedChannel.name}</h4>
                  {selectedChannel.description && (
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {selectedChannel.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Phone size={16} />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Video size={16} />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical size={16} />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <MessageList messages={messages} currentUserId={user?.id || ''} />

            {/* Input */}
            <MessageInput onSend={handleSendMessage} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-sm">Select a channel to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
