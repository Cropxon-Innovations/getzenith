import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Notification {
  id: string;
  tenant_id: string;
  user_id: string | null;
  type: 'info' | 'success' | 'warning' | 'error' | 'team' | 'content' | 'system';
  title: string;
  message: string | null;
  data: Record<string, unknown>;
  read: boolean;
  created_at: string;
}

export const useNotifications = () => {
  const { user, tenant } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!user || !tenant) return;

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('tenant_id', tenant.id)
      .or(`user_id.eq.${user.id},user_id.is.null`)
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setNotifications(data as Notification[]);
      setUnreadCount(data.filter((n: { read: boolean }) => !n.read).length);
    }
    setIsLoading(false);
  };

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (!error) {
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false);

    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (!error) {
      const notification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    }
  };

  const createNotification = async (
    type: Notification['type'],
    title: string,
    message?: string,
    targetUserId?: string
  ) => {
    if (!tenant) return;

    const { error } = await supabase.from('notifications').insert({
      tenant_id: tenant.id,
      user_id: targetUserId || null,
      type,
      title,
      message,
    });

    return { error };
  };

  useEffect(() => {
    fetchNotifications();
  }, [user, tenant]);

  // Real-time subscription
  useEffect(() => {
    if (!user || !tenant) return;

    const channel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `tenant_id=eq.${tenant.id}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          if (newNotification.user_id === user.id || newNotification.user_id === null) {
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, tenant]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    refetch: fetchNotifications,
  };
};
