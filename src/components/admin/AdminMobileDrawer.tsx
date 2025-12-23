import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Palette,
  Globe,
  GraduationCap,
  Zap,
  Users,
  Settings,
  CreditCard,
  BarChart3,
  Building2,
  Shield,
  Paintbrush,
  Link2,
  Bell,
  Layers,
  BookOpen,
  MessageSquare,
  Video,
  TrendingUp,
  Plug,
  Briefcase,
  Crown,
  CheckCircle2,
  AlertCircle,
  Mail,
  Phone,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ZenithLogo } from '@/components/ZenithLogo';
import { useAuth, AppRole } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: string;
  roles: AppRole[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
  roles: AppRole[];
}

const adminNavigation: NavGroup[] = [
  {
    title: 'Overview',
    roles: ['tenant_admin', 'editor', 'mentor', 'viewer'],
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/admin', roles: ['tenant_admin', 'editor', 'mentor', 'viewer'] },
      { icon: BarChart3, label: 'Analytics', href: '/admin/analytics', roles: ['tenant_admin', 'editor'] },
      { icon: TrendingUp, label: 'Growth', href: '/admin/growth', roles: ['tenant_admin'] },
    ],
  },
  {
    title: 'Studios',
    roles: ['tenant_admin', 'editor', 'mentor'],
    items: [
      { icon: FileText, label: 'CMS Studio', href: '/studio/cms', roles: ['tenant_admin', 'editor'] },
      { icon: Palette, label: 'Canvas Studio', href: '/studio/canvas', roles: ['tenant_admin', 'editor'] },
      { icon: Globe, label: 'Website Builder', href: '/studio/website', roles: ['tenant_admin', 'editor'] },
      { icon: GraduationCap, label: 'LMS Studio', href: '/studio/lms', roles: ['tenant_admin', 'editor', 'mentor'] },
      { icon: Zap, label: 'Automation', href: '/studio/automation', badge: 'Pro', roles: ['tenant_admin'] },
    ],
  },
  {
    title: 'Content',
    roles: ['tenant_admin', 'editor', 'mentor'],
    items: [
      { icon: Layers, label: 'All Content', href: '/admin/content', roles: ['tenant_admin', 'editor', 'mentor'] },
      { icon: BookOpen, label: 'Courses', href: '/admin/content/courses', roles: ['tenant_admin', 'mentor'] },
      { icon: Video, label: 'Media Library', href: '/admin/content/media', roles: ['tenant_admin', 'editor'] },
    ],
  },
  {
    title: 'Team',
    roles: ['tenant_admin'],
    items: [
      { icon: Users, label: 'Members', href: '/admin/team', roles: ['tenant_admin'] },
      { icon: Shield, label: 'Roles & Permissions', href: '/admin/team/roles', roles: ['tenant_admin'] },
      { icon: Bell, label: 'Invitations', href: '/admin/team/invites', roles: ['tenant_admin'] },
    ],
  },
  {
    title: 'Business',
    roles: ['tenant_admin'],
    items: [
      { icon: Briefcase, label: 'Business Settings', href: '/admin/business', roles: ['tenant_admin'] },
      { icon: Paintbrush, label: 'Branding', href: '/admin/business?tab=branding', roles: ['tenant_admin'] },
      { icon: Link2, label: 'Domains', href: '/admin/business?tab=domains', roles: ['tenant_admin'] },
    ],
  },
  {
    title: 'Platform',
    roles: ['tenant_admin'],
    items: [
      { icon: Plug, label: 'Integrations', href: '/admin/integrations', roles: ['tenant_admin'] },
      { icon: Bell, label: 'Notifications', href: '/admin/notifications', roles: ['tenant_admin'] },
      { icon: MessageSquare, label: 'Messaging', href: '/admin/messaging', badge: 'Enterprise', roles: ['tenant_admin'] },
      { icon: Video, label: 'Meetings', href: '/admin/meetings', badge: 'Enterprise', roles: ['tenant_admin'] },
      { icon: CreditCard, label: 'Billing', href: '/admin/billing', roles: ['tenant_admin'] },
      { icon: Building2, label: 'Settings', href: '/admin/settings', roles: ['tenant_admin'] },
    ],
  },
];

const mentorNavigation: NavGroup[] = [
  {
    title: 'Teaching',
    roles: ['mentor'],
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/mentor', roles: ['mentor'] },
      { icon: BookOpen, label: 'My Courses', href: '/mentor/courses', roles: ['mentor'] },
      { icon: Users, label: 'Students', href: '/mentor/students', roles: ['mentor'] },
      { icon: Video, label: 'Live Sessions', href: '/mentor/sessions', roles: ['mentor'] },
      { icon: MessageSquare, label: 'Messages', href: '/mentor/messages', roles: ['mentor'] },
    ],
  },
];

const viewerNavigation: NavGroup[] = [
  {
    title: 'View',
    roles: ['viewer'],
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/admin', roles: ['viewer'] },
      { icon: Layers, label: 'Content', href: '/admin/content', roles: ['viewer'] },
    ],
  },
];

const RoleBadge = ({ role }: { role: AppRole }) => {
  const roleConfig: Record<AppRole, { label: string; className: string; icon: LucideIcon }> = {
    tenant_admin: { label: 'Admin', className: 'bg-primary/20 text-primary border-primary/30', icon: Crown },
    editor: { label: 'Editor', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: FileText },
    mentor: { label: 'Mentor', className: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: GraduationCap },
    viewer: { label: 'Viewer', className: 'bg-muted text-muted-foreground border-border', icon: Users },
  };
  const config = roleConfig[role];
  const Icon = config.icon;
  return (
    <Badge variant="outline" className={cn('text-[10px] px-2 py-0.5 gap-1', config.className)}>
      <Icon size={10} />
      {config.label}
    </Badge>
  );
};

const VerificationBadge = ({ type, verified }: { type: 'email' | 'phone'; verified: boolean }) => {
  const Icon = type === 'email' ? Mail : Phone;
  const StatusIcon = verified ? CheckCircle2 : AlertCircle;
  return (
    <div className={cn(
      'flex items-center gap-1 text-xs px-2 py-1 rounded-full',
      verified ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'
    )}>
      <Icon size={12} />
      <StatusIcon size={10} />
    </div>
  );
};

interface AdminMobileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AdminMobileDrawer = ({ open, onOpenChange }: AdminMobileDrawerProps) => {
  const { user, profile, tenant, userRole } = useAuth();
  const location = useLocation();

  const effectiveRole: AppRole = userRole || 'tenant_admin';

  const getNavigationForRole = (): NavGroup[] => {
    if (effectiveRole === 'mentor') return mentorNavigation;
    if (effectiveRole === 'viewer') return viewerNavigation;
    return adminNavigation;
  };

  const navigation = getNavigationForRole();

  const filteredNavigation = navigation
    .filter(group => group.roles.includes(effectiveRole))
    .map(group => ({
      ...group,
      items: group.items.filter(item => item.roles.includes(effectiveRole)),
    }))
    .filter(group => group.items.length > 0);

  const isActive = (href: string) => {
    if (href.includes('?')) return location.pathname + location.search === href;
    if (href === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(href);
  };

  const emailVerified = !!user?.email_confirmed_at;
  const phoneVerified = !!user?.phone_confirmed_at;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80 p-0 bg-sidebar">
        <SheetHeader className="border-b border-sidebar-border px-4 py-3">
          <div className="flex items-center gap-3">
            <ZenithLogo size={32} />
            <div className="flex flex-col">
              <SheetTitle className="text-sm font-semibold text-left">
                {tenant?.name || 'Zenith'}
              </SheetTitle>
              <span className="text-[10px] text-muted-foreground">
                {tenant?.subdomain || 'Enterprise Platform'}
              </span>
            </div>
          </div>
        </SheetHeader>

        {/* User Profile */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-11 w-11 border-2 border-primary/30">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/20 text-primary">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{profile?.full_name || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <RoleBadge role={effectiveRole} />
            <VerificationBadge type="email" verified={emailVerified} />
            <VerificationBadge type="phone" verified={phoneVerified} />
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-12rem)]">
          <nav className="p-3 space-y-4">
            {filteredNavigation.map((group) => (
              <div key={group.title}>
                <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                  {group.title}
                </h3>
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const active = isActive(item.href);
                    const ItemIcon = item.icon;
                    return (
                      <li key={item.href}>
                        <Link
                          to={item.href}
                          onClick={() => onOpenChange(false)}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                            active ? 'bg-primary text-primary-foreground font-medium' : 'text-sidebar-foreground hover:bg-sidebar-accent'
                          )}
                        >
                          <ItemIcon size={18} className={cn(!active && 'text-muted-foreground')} />
                          <span className="flex-1">{item.label}</span>
                          {item.badge && <Badge variant="secondary" className="text-[9px] px-1.5 py-0">{item.badge}</Badge>}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </ScrollArea>

        <div className="p-2 border-t border-sidebar-border">
          <Link
            to="/admin/settings"
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-sidebar-accent"
          >
            <Settings size={18} className="text-muted-foreground" />
            <span>Settings</span>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AdminMobileDrawer;