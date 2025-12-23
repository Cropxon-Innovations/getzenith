import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
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
  Clock,
  CheckCircle2,
  AlertCircle,
  Mail,
  Phone,
  Crown,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ZenithLogo } from '@/components/ZenithLogo';
import { useAuth, AppRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
  defaultOpen?: boolean;
}

// Navigation structure based on RBAC
const adminNavigation: NavGroup[] = [
  {
    title: 'Overview',
    roles: ['tenant_admin', 'editor', 'mentor', 'viewer'],
    defaultOpen: true,
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/admin', roles: ['tenant_admin', 'editor', 'mentor', 'viewer'] },
      { icon: BarChart3, label: 'Analytics', href: '/admin/analytics', roles: ['tenant_admin', 'editor'] },
      { icon: TrendingUp, label: 'Growth', href: '/admin/growth', roles: ['tenant_admin'] },
    ],
  },
  {
    title: 'Studios',
    roles: ['tenant_admin', 'editor', 'mentor'],
    defaultOpen: true,
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
    defaultOpen: false,
    items: [
      { icon: Layers, label: 'All Content', href: '/admin/content', roles: ['tenant_admin', 'editor', 'mentor'] },
      { icon: BookOpen, label: 'Courses', href: '/admin/content/courses', roles: ['tenant_admin', 'mentor'] },
      { icon: Video, label: 'Media Library', href: '/admin/content/media', roles: ['tenant_admin', 'editor'] },
    ],
  },
  {
    title: 'Team',
    roles: ['tenant_admin'],
    defaultOpen: false,
    items: [
      { icon: Users, label: 'Members', href: '/admin/team', roles: ['tenant_admin'] },
      { icon: Shield, label: 'Roles & Permissions', href: '/admin/team/roles', roles: ['tenant_admin'] },
      { icon: Bell, label: 'Invitations', href: '/admin/team/invites', roles: ['tenant_admin'] },
    ],
  },
  {
    title: 'Business',
    roles: ['tenant_admin'],
    defaultOpen: false,
    items: [
      { icon: Briefcase, label: 'Business Settings', href: '/admin/business', roles: ['tenant_admin'] },
      { icon: Paintbrush, label: 'Branding', href: '/admin/business?tab=branding', roles: ['tenant_admin'] },
      { icon: Link2, label: 'Domains', href: '/admin/business?tab=domains', roles: ['tenant_admin'] },
    ],
  },
  {
    title: 'Platform',
    roles: ['tenant_admin'],
    defaultOpen: false,
    items: [
      { icon: Plug, label: 'Integrations', href: '/admin/integrations', roles: ['tenant_admin'] },
      { icon: Bell, label: 'Notifications', href: '/admin/notifications', roles: ['tenant_admin'] },
      { icon: CreditCard, label: 'Billing', href: '/admin/billing', roles: ['tenant_admin'] },
      { icon: Building2, label: 'Settings', href: '/admin/settings', roles: ['tenant_admin'] },
    ],
  },
];

// Mentor-specific navigation
const mentorNavigation: NavGroup[] = [
  {
    title: 'Teaching',
    roles: ['mentor'],
    defaultOpen: true,
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/mentor', roles: ['mentor'] },
      { icon: BookOpen, label: 'My Courses', href: '/mentor/courses', roles: ['mentor'] },
      { icon: Users, label: 'Students', href: '/mentor/students', roles: ['mentor'] },
      { icon: Video, label: 'Live Sessions', href: '/mentor/sessions', roles: ['mentor'] },
      { icon: MessageSquare, label: 'Messages', href: '/mentor/messages', roles: ['mentor'] },
    ],
  },
];

// Viewer-specific navigation (minimal access)
const viewerNavigation: NavGroup[] = [
  {
    title: 'View',
    roles: ['viewer'],
    defaultOpen: true,
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/admin', roles: ['viewer'] },
      { icon: Layers, label: 'Content', href: '/admin/content', roles: ['viewer'] },
    ],
  },
];

interface AdminSidebarProps {
  className?: string;
}

// Session timer component
const SessionTimer = ({ startTime }: { startTime: Date }) => {
  const [elapsed, setElapsed] = useState('00:00:00');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      const hours = Math.floor(diff / 3600).toString().padStart(2, '0');
      const minutes = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
      const seconds = (diff % 60).toString().padStart(2, '0');
      setElapsed(`${hours}:${minutes}:${seconds}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Clock size={12} />
      <span className="font-mono">{elapsed}</span>
    </div>
  );
};

// Role badge component
const RoleBadge = ({ role }: { role: AppRole | null }) => {
  const roleConfig: Record<AppRole, { label: string; className: string; icon: LucideIcon }> = {
    tenant_admin: { label: 'Admin', className: 'bg-primary/20 text-primary border-primary/30', icon: Crown },
    editor: { label: 'Editor', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: FileText },
    mentor: { label: 'Mentor', className: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: GraduationCap },
    viewer: { label: 'Viewer', className: 'bg-muted text-muted-foreground border-border', icon: Users },
  };

  const config = role ? roleConfig[role] : roleConfig.viewer;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0.5 gap-1', config.className)}>
      <Icon size={10} />
      {config.label}
    </Badge>
  );
};

// Verification badge component
const VerificationBadge = ({ type, verified, collapsed }: { type: 'email' | 'phone'; verified: boolean; collapsed?: boolean }) => {
  const Icon = type === 'email' ? Mail : Phone;
  const StatusIcon = verified ? CheckCircle2 : AlertCircle;

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            'p-1 rounded-full',
            verified ? 'bg-green-500/20' : 'bg-amber-500/20'
          )}>
            <Icon size={12} className={verified ? 'text-green-400' : 'text-amber-400'} />
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">
          {type === 'email' ? 'Email' : 'Phone'}: {verified ? 'Verified' : 'Not Verified'}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className={cn(
      'flex items-center gap-1.5 text-xs px-2 py-1 rounded-full',
      verified ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'
    )}>
      <Icon size={12} />
      <StatusIcon size={10} />
    </div>
  );
};

export const AdminSidebar = ({ className }: AdminSidebarProps) => {
  const { user, profile, tenant, userRole } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [sessionStart] = useState(new Date());
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    Overview: true,
    Studios: true,
    Teaching: true,
    View: true,
  });

  // Determine effective role - default to tenant_admin for testing if no role found
  const effectiveRole: AppRole = userRole || 'tenant_admin';

  // Get navigation based on role
  const getNavigationForRole = (): NavGroup[] => {
    if (effectiveRole === 'mentor') {
      return mentorNavigation;
    }
    if (effectiveRole === 'viewer') {
      return viewerNavigation;
    }
    // tenant_admin and editor get full admin navigation
    return adminNavigation;
  };

  const navigation = getNavigationForRole();

  // Filter groups and items by role
  const filteredNavigation = navigation
    .filter(group => group.roles.includes(effectiveRole))
    .map(group => ({
      ...group,
      items: group.items.filter(item => item.roles.includes(effectiveRole)),
    }))
    .filter(group => group.items.length > 0);

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isActive = (href: string) => {
    if (href.includes('?')) {
      return location.pathname + location.search === href;
    }
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  const emailVerified = !!user?.email_confirmed_at;
  const phoneVerified = !!user?.phone_confirmed_at;

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 280 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={cn(
          'h-screen bg-sidebar border-r border-sidebar-border flex flex-col',
          className
        )}
      >
        {/* Header */}
        <div className="h-16 border-b border-sidebar-border flex items-center justify-between px-3">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 overflow-hidden"
              >
                <ZenithLogo size={32} />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-sidebar-foreground truncate">
                    {tenant?.name || 'Zenith'}
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate">
                    {tenant?.subdomain || 'Enterprise Platform'}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {collapsed && (
            <div className="mx-auto">
              <ZenithLogo size={32} />
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="shrink-0 h-8 w-8"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>

        {/* User Profile Section */}
        <div className={cn(
          'border-b border-sidebar-border',
          collapsed ? 'p-2' : 'p-3'
        )}>
          {collapsed ? (
            <div className="flex flex-col items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="h-10 w-10 border-2 border-primary/30">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {profile?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent side="right" className="flex flex-col gap-1">
                  <p className="font-medium">{profile?.full_name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </TooltipContent>
              </Tooltip>
              <div className="flex gap-1">
                <VerificationBadge type="email" verified={emailVerified} collapsed />
                <VerificationBadge type="phone" verified={phoneVerified} collapsed />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11 border-2 border-primary/30 ring-2 ring-primary/10">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/20 text-primary font-medium">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {profile?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              
              {/* Role & Session Info */}
              <div className="flex items-center justify-between">
                <RoleBadge role={effectiveRole} />
                <SessionTimer startTime={sessionStart} />
              </div>

              {/* Verification Status */}
              <div className="flex gap-2">
                <VerificationBadge type="email" verified={emailVerified} />
                <VerificationBadge type="phone" verified={phoneVerified} />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {filteredNavigation.map((group, groupIndex) => (
            <div key={group.title} className={cn(groupIndex > 0 && 'mt-4')}>
              {/* Group Header */}
              {!collapsed && (
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="w-full flex items-center justify-between px-2 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hover:text-sidebar-foreground transition-colors"
                >
                  <span>{group.title}</span>
                  <ChevronDown
                    size={12}
                    className={cn(
                      'transition-transform duration-200',
                      expandedGroups[group.title] ? '' : '-rotate-90'
                    )}
                  />
                </button>
              )}

              {collapsed && groupIndex > 0 && (
                <Separator className="my-2 mx-2" />
              )}

              {/* Group Items */}
              <AnimatePresence initial={false}>
                {(collapsed || expandedGroups[group.title] !== false) && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-0.5 overflow-hidden"
                  >
                    {group.items.map((item) => {
                      const active = isActive(item.href);
                      const ItemIcon = item.icon;

                      const linkContent = (
                        <Link
                          to={item.href}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200',
                            'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                            active
                              ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                              : 'text-sidebar-foreground',
                            collapsed && 'justify-center px-2'
                          )}
                        >
                          <ItemIcon
                            size={18}
                            className={cn(
                              'shrink-0 transition-colors',
                              active ? '' : 'text-muted-foreground group-hover:text-sidebar-foreground'
                            )}
                          />
                          {!collapsed && (
                            <>
                              <span className="flex-1 truncate">{item.label}</span>
                              {item.badge && (
                                <Badge variant="secondary" className="text-[9px] px-1.5 py-0 font-medium">
                                  {item.badge}
                                </Badge>
                              )}
                            </>
                          )}
                        </Link>
                      );

                      if (collapsed) {
                        return (
                          <li key={item.href}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                {linkContent}
                              </TooltipTrigger>
                              <TooltipContent side="right" className="flex items-center gap-2">
                                {item.label}
                                {item.badge && (
                                  <Badge variant="secondary" className="text-[10px]">
                                    {item.badge}
                                  </Badge>
                                )}
                              </TooltipContent>
                            </Tooltip>
                          </li>
                        );
                      }

                      return <li key={item.href}>{linkContent}</li>;
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-2">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/admin/settings"
                  className={cn(
                    'flex items-center justify-center p-2 rounded-lg hover:bg-sidebar-accent transition-colors',
                    location.pathname === '/admin/settings' && 'bg-sidebar-accent'
                  )}
                >
                  <Settings size={18} className="text-muted-foreground" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          ) : (
            <Link
              to="/admin/settings"
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors',
                location.pathname === '/admin/settings' && 'bg-sidebar-accent'
              )}
            >
              <Settings size={18} className="text-muted-foreground" />
              <span>Settings</span>
            </Link>
          )}
        </div>
      </motion.aside>
    </TooltipProvider>
  );
};

export default AdminSidebar;