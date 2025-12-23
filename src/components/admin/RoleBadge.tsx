import { AppRole } from '@/contexts/AuthContext';
import { Shield, Crown, Edit3, Eye, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RoleBadgeProps {
  role: AppRole | null;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const roleConfig: Record<AppRole, {
  label: string;
  icon: typeof Shield;
  className: string;
}> = {
  tenant_admin: {
    label: 'Admin',
    icon: Crown,
    className: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
  },
  editor: {
    label: 'Editor',
    icon: Edit3,
    className: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
  },
  mentor: {
    label: 'Mentor',
    icon: GraduationCap,
    className: 'bg-purple-500/20 text-purple-500 border-purple-500/30',
  },
  viewer: {
    label: 'Viewer',
    icon: Eye,
    className: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  },
};

export const RoleBadge = ({ role, size = 'md', showIcon = true }: RoleBadgeProps) => {
  if (!role) {
    return (
      <Badge variant="outline" className="bg-muted text-muted-foreground">
        No Role
      </Badge>
    );
  }

  const config = roleConfig[role];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-0.5',
    lg: 'text-sm px-3 py-1',
  };

  const iconSizes = {
    sm: 10,
    md: 12,
    lg: 14,
  };

  return (
    <Badge
      variant="outline"
      className={`${config.className} ${sizeClasses[size]} font-medium`}
    >
      {showIcon && <Icon size={iconSizes[size]} className="mr-1" />}
      {config.label}
    </Badge>
  );
};
