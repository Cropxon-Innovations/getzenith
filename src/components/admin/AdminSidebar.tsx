import { useState } from 'react';
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
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ZenithLogo } from '@/components/ZenithLogo';
import { useAuth, AppRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
      { icon: Building2, label: 'Settings', href: '/admin/settings', roles: ['tenant_admin'] },
      { icon: CreditCard, label: 'Billing', href: '/admin/settings?tab=billing', roles: ['tenant_admin'] },
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

export const AdminSidebar = ({ className }: AdminSidebarProps) => {
  const { tenant, userRole } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    Overview: true,
    Studios: true,
    Teaching: true,
  });

  // Get navigation based on role
  const getNavigationForRole = (): NavGroup[] => {
    if (userRole === 'mentor') {
      return mentorNavigation;
    }
    if (userRole === 'viewer') {
      return viewerNavigation;
    }
    // tenant_admin and editor get full admin navigation
    return adminNavigation;
  };

  const navigation = getNavigationForRole();

  // Filter groups and items by role
  const filteredNavigation = navigation
    .filter(group => group.roles.includes(userRole || 'viewer'))
    .map(group => ({
      ...group,
      items: group.items.filter(item => item.roles.includes(userRole || 'viewer')),
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
    return location.pathname === href;
  };

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 64 : 256 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={cn(
          'h-screen bg-sidebar border-r border-sidebar-border flex flex-col',
          className
        )}
      >
        {/* Header */}
        <div className="h-16 border-b border-sidebar-border flex items-center justify-between px-4">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 overflow-hidden"
              >
                <ZenithLogo size={28} />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-sidebar-foreground truncate">
                    {tenant?.name || 'Zenith'}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {userRole === 'tenant_admin' ? 'Admin' : userRole}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {collapsed && (
            <div className="mx-auto">
              <ZenithLogo size={28} />
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

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {filteredNavigation.map((group) => (
            <div key={group.title} className="mb-4">
              {/* Group Header */}
              {!collapsed && (
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-sidebar-foreground transition-colors"
                >
                  <span>{group.title}</span>
                  <ChevronDown
                    size={14}
                    className={cn(
                      'transition-transform duration-200',
                      expandedGroups[group.title] ? '' : '-rotate-90'
                    )}
                  />
                </button>
              )}

              {/* Group Items */}
              <AnimatePresence initial={false}>
                {(collapsed || expandedGroups[group.title]) && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1 overflow-hidden"
                  >
                    {group.items.map((item) => {
                      const active = isActive(item.href);
                      const ItemIcon = item.icon;

                      const linkContent = (
                        <Link
                          to={item.href}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                            'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                            active
                              ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                              : 'text-sidebar-foreground'
                          )}
                        >
                          <ItemIcon
                            size={18}
                            className={cn(
                              'shrink-0',
                              active ? '' : 'text-muted-foreground'
                            )}
                          />
                          {!collapsed && (
                            <>
                              <span className="flex-1 truncate">{item.label}</span>
                              {item.badge && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
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
                  className="flex items-center justify-center p-2 rounded-md hover:bg-sidebar-accent transition-colors"
                >
                  <Settings size={18} className="text-muted-foreground" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          ) : (
            <Link
              to="/admin/settings"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
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