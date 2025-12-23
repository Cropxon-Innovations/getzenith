import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CollaboratorCursor, UserRole, PlanTier, ContentLock } from '../state/types';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface User {
  id: string;
  name: string;
  initials: string;
  color: string;
  role: UserRole;
}

interface CollaborationContextType {
  currentUser: User;
  collaborators: CollaboratorCursor[];
  locks: ContentLock[];
  plan: PlanTier;
  isCollaborationEnabled: boolean;
  updateCursor: (x: number, y: number) => void;
  canEdit: boolean;
  canPublish: boolean;
  canManageUsers: boolean;
  acquireLock: (sectionId: string | null) => Promise<boolean>;
  releaseLock: (sectionId: string | null) => Promise<void>;
  isLocked: (sectionId: string | null) => boolean;
  getLockOwner: (sectionId: string | null) => string | null;
}

const COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16',
];

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

interface CollaborationProviderProps {
  children: React.ReactNode;
  contentId?: string;
}

export const CollaborationProvider: React.FC<CollaborationProviderProps> = ({ children, contentId }) => {
  // Mock current user - in production this would come from auth
  const [currentUser] = useState<User>({
    id: 'user-1',
    name: 'You',
    initials: 'YO',
    color: COLORS[0],
    role: 'tenant_admin',
  });

  // Mock plan tier - in production this would come from subscription
  const [plan] = useState<PlanTier>('pro');

  // Collaborators from Supabase Realtime Presence
  const [collaborators, setCollaborators] = useState<CollaboratorCursor[]>([]);
  const [locks, setLocks] = useState<ContentLock[]>([]);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  const isCollaborationEnabled = plan !== 'free';

  // Permissions based on role
  const canEdit = ['tenant_admin', 'editor', 'mentor'].includes(currentUser.role);
  const canPublish = ['tenant_admin', 'editor'].includes(currentUser.role);
  const canManageUsers = currentUser.role === 'tenant_admin';

  // Set up Supabase Realtime Presence
  useEffect(() => {
    if (!isCollaborationEnabled || !contentId) return;

    const channelName = `content:${contentId}`;
    const realtimeChannel = supabase.channel(channelName, {
      config: { presence: { key: currentUser.id } }
    });

    realtimeChannel
      .on('presence', { event: 'sync' }, () => {
        const state = realtimeChannel.presenceState();
        const others: CollaboratorCursor[] = [];
        
        Object.entries(state).forEach(([key, presences]) => {
          if (key !== currentUser.id && presences.length > 0) {
            const presence = presences[0] as any;
            others.push({
              id: key,
              name: presence.user_name || 'Anonymous',
              color: presence.color || COLORS[Math.floor(Math.random() * COLORS.length)],
              x: presence.x || 0,
              y: presence.y || 0,
              lastActive: new Date(),
              editingSection: presence.editing_section,
            });
          }
        });
        
        setCollaborators(others);
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        setCollaborators(prev => prev.filter(c => c.id !== key));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await realtimeChannel.track({
            user_name: currentUser.name,
            color: currentUser.color,
            x: 0,
            y: 0,
            editing_section: null,
          });
        }
      });

    setChannel(realtimeChannel);

    return () => {
      realtimeChannel.unsubscribe();
    };
  }, [contentId, isCollaborationEnabled, currentUser]);

  // Update local cursor position and broadcast
  const updateCursor = useCallback((x: number, y: number) => {
    if (!channel || !isCollaborationEnabled) return;
    
    channel.track({
      user_name: currentUser.name,
      color: currentUser.color,
      x,
      y,
      editing_section: null,
    });
  }, [channel, currentUser, isCollaborationEnabled]);

  // Lock management
  const acquireLock = useCallback(async (sectionId: string | null): Promise<boolean> => {
    // Mock implementation - in production use database
    return true;
  }, []);

  const releaseLock = useCallback(async (sectionId: string | null): Promise<void> => {
    // Mock implementation - in production use database
  }, []);

  const isLocked = useCallback((sectionId: string | null): boolean => {
    return locks.some(l => l.section_id === sectionId && l.locked_by !== currentUser.id);
  }, [locks, currentUser.id]);

  const getLockOwner = useCallback((sectionId: string | null): string | null => {
    const lock = locks.find(l => l.section_id === sectionId && l.locked_by !== currentUser.id);
    return lock?.locked_by_name || null;
  }, [locks, currentUser.id]);

  return (
    <CollaborationContext.Provider
      value={{
        currentUser,
        collaborators,
        locks,
        plan,
        isCollaborationEnabled,
        updateCursor,
        canEdit,
        canPublish,
        canManageUsers,
        acquireLock,
        releaseLock,
        isLocked,
        getLockOwner,
      }}
    >
      {children}
    </CollaborationContext.Provider>
  );
};

export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
};
