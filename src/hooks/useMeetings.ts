import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Meeting {
  id: string;
  tenant_id: string;
  title: string;
  description: string | null;
  host_id: string;
  participants: string[];
  scheduled_at: string | null;
  duration_minutes: number;
  meeting_link: string | null;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  host?: {
    id: string;
    full_name: string;
    avatar_url?: string;
    email?: string;
  };
}

export const useMeetings = () => {
  const { user, tenant } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMeetings = useCallback(async () => {
    if (!tenant) return;

    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('tenant_id', tenant.id)
      .order('scheduled_at', { ascending: true });

    if (!error && data) {
      // Fetch host profiles
      const hostIds = [...new Set(data.map(m => m.host_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', hostIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      setMeetings(
        data.map((m) => ({
          id: m.id,
          tenant_id: m.tenant_id,
          title: m.title,
          description: m.description,
          host_id: m.host_id,
          participants: (m.participants as string[]) || [],
          scheduled_at: m.scheduled_at,
          duration_minutes: m.duration_minutes || 60,
          meeting_link: m.meeting_link,
          status: (m.status as Meeting['status']) || 'scheduled',
          created_at: m.created_at || new Date().toISOString(),
          host: profileMap.get(m.host_id)
            ? {
                id: profileMap.get(m.host_id)!.id,
                full_name: profileMap.get(m.host_id)!.full_name || 'Unknown',
                avatar_url: profileMap.get(m.host_id)!.avatar_url || undefined,
              }
            : undefined,
        }))
      );
    }
    setIsLoading(false);
  }, [tenant]);

  const createMeeting = async (
    title: string,
    description: string,
    scheduledAt: Date,
    durationMinutes: number,
    participantEmails: string[]
  ) => {
    if (!user || !tenant) return { error: new Error('Not authenticated') };

    // Generate meeting link
    const meetingId = crypto.randomUUID().slice(0, 8);
    const meetingLink = `${window.location.origin}/meet/${meetingId}`;

    const { data, error } = await supabase
      .from('meetings')
      .insert({
        tenant_id: tenant.id,
        title,
        description,
        host_id: user.id,
        scheduled_at: scheduledAt.toISOString(),
        duration_minutes: durationMinutes,
        meeting_link: meetingLink,
        status: 'scheduled',
      })
      .select()
      .single();

    if (!error && data) {
      // Create notification for meeting
      await supabase.from('notifications').insert({
        tenant_id: tenant.id,
        user_id: user.id,
        type: 'info',
        title: 'Meeting Scheduled',
        message: `"${title}" scheduled for ${scheduledAt.toLocaleString()}`,
      });

      await fetchMeetings();
    }

    return { data, error };
  };

  const updateMeetingStatus = async (meetingId: string, status: Meeting['status']) => {
    const { error } = await supabase
      .from('meetings')
      .update({ status })
      .eq('id', meetingId);

    if (!error) {
      setMeetings((prev) =>
        prev.map((m) => (m.id === meetingId ? { ...m, status } : m))
      );
    }

    return { error };
  };

  const deleteMeeting = async (meetingId: string) => {
    const { error } = await supabase
      .from('meetings')
      .delete()
      .eq('id', meetingId);

    if (!error) {
      setMeetings((prev) => prev.filter((m) => m.id !== meetingId));
    }

    return { error };
  };

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  // Real-time subscription
  useEffect(() => {
    if (!tenant) return;

    const channel = supabase
      .channel('meetings-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meetings',
          filter: `tenant_id=eq.${tenant.id}`,
        },
        () => {
          fetchMeetings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tenant, fetchMeetings]);

  return {
    meetings,
    isLoading,
    createMeeting,
    updateMeetingStatus,
    deleteMeeting,
    refetch: fetchMeetings,
  };
};
