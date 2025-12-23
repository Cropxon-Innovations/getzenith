import { useAuth, AppRole } from '@/contexts/AuthContext';

interface RolePermissions {
  canManageTeam: boolean;
  canManageBilling: boolean;
  canManageSettings: boolean;
  canViewAnalytics: boolean;
  canManageContent: boolean;
  canPublishContent: boolean;
  canAccessMessaging: boolean;
  canScheduleMeetings: boolean;
  canInviteUsers: boolean;
  isAdmin: boolean;
  isOwner: boolean;
}

const ROLE_HIERARCHY: Record<AppRole, number> = {
  tenant_admin: 4,
  editor: 3,
  mentor: 2,
  viewer: 1,
};

export const useRoleAccess = (): RolePermissions & { userRole: AppRole | null; hasRole: (role: AppRole) => boolean } => {
  const { userRole, tenant } = useAuth();

  const hasRole = (requiredRole: AppRole): boolean => {
    if (!userRole) return false;
    return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
  };

  const isAdmin = userRole === 'tenant_admin';
  const isOwner = userRole === 'tenant_admin'; // In this system, tenant_admin is the owner
  const isEnterprise = tenant?.plan === 'enterprise';

  return {
    userRole,
    hasRole,
    isAdmin,
    isOwner,
    canManageTeam: isAdmin,
    canManageBilling: isAdmin,
    canManageSettings: isAdmin,
    canViewAnalytics: hasRole('editor'),
    canManageContent: hasRole('editor'),
    canPublishContent: hasRole('editor'),
    canAccessMessaging: isEnterprise,
    canScheduleMeetings: isEnterprise && hasRole('editor'),
    canInviteUsers: isAdmin,
  };
};
