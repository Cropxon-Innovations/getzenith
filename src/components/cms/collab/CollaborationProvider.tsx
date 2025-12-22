import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CollaboratorCursor, UserRole, PlanTier } from '../state/types';

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
  plan: PlanTier;
  isCollaborationEnabled: boolean;
  updateCursor: (x: number, y: number) => void;
  canEdit: boolean;
  canPublish: boolean;
  canManageUsers: boolean;
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

  // Mock collaborators - in production this would come from Supabase Realtime
  const [collaborators, setCollaborators] = useState<CollaboratorCursor[]>([]);

  const isCollaborationEnabled = plan !== 'free';

  // Permissions based on role
  const canEdit = ['tenant_admin', 'editor', 'mentor'].includes(currentUser.role);
  const canPublish = ['tenant_admin', 'editor'].includes(currentUser.role);
  const canManageUsers = currentUser.role === 'tenant_admin';

  // Update local cursor position
  const updateCursor = useCallback((x: number, y: number) => {
    if (!isCollaborationEnabled) return;
    
    // In production, this would broadcast to Supabase Realtime
    // For now, we just log it
    // console.log('Cursor update:', { x, y, user: currentUser.name });
  }, [isCollaborationEnabled, currentUser.name]);

  // Simulate other collaborators (demo purposes)
  useEffect(() => {
    if (!isCollaborationEnabled || !contentId) return;

    // Mock collaborator for demo
    const mockCollaborators: CollaboratorCursor[] = [
      {
        id: 'user-2',
        name: 'Sarah Chen',
        color: COLORS[1],
        x: 0,
        y: 0,
        lastActive: new Date(),
      },
    ];

    // Only show if this is an existing content (not new)
    if (!contentId.startsWith('new') && !contentId.startsWith('content-')) {
      setCollaborators(mockCollaborators);
    } else {
      setCollaborators([]);
    }

    return () => setCollaborators([]);
  }, [isCollaborationEnabled, contentId]);

  return (
    <CollaborationContext.Provider
      value={{
        currentUser,
        collaborators,
        plan,
        isCollaborationEnabled,
        updateCursor,
        canEdit,
        canPublish,
        canManageUsers,
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
