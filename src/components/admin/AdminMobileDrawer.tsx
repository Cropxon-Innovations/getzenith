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
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ZenithLogo } from '@/components/ZenithLogo';
import { useAuth, AppRole } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
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
    title: 'Team',
    roles: ['tenant_admin'],
    items: [
      { icon: Users, label: 'Members', href: '/admin/team', roles: ['tenant_admin'] },
      { icon: Shield, label: 'Roles & Permissions', href: '/admin/team/roles', roles: ['tenant_admin'] },
      { icon: Bell, label: 'Invitations', href: '/admin/team/invites', roles: ['tenant_admin'] },
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
    title: 'Settings',
    roles: ['tenant_admin'],
    items: [
      { icon: Building2, label: 'General', href: '/admin/settings', roles: ['tenant_admin'] },
      { icon: Paintbrush, label: 'Branding', href: '/admin/settings?tab=branding', roles: ['tenant_admin'] },
      { icon: Link2, label: 'Domains', href: '/admin/settings?tab=domains', roles: ['tenant_admin'] },
      { icon: CreditCard, label: 'Billing', href: '/admin/settings?tab=billing', roles: ['tenant_admin'] },
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

interface AdminMobileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AdminMobileDrawer = ({ open, onOpenChange }: AdminMobileDrawerProps) => {
  const { tenant, userRole } = useAuth();
  const location = useLocation();

  const getNavigationForRole = (): NavGroup[] => {
    if (userRole === 'mentor') return mentorNavigation;
    if (userRole === 'viewer') return viewerNavigation;
    return adminNavigation;
  };

  const navigation = getNavigationForRole();

  const filteredNavigation = navigation
    .filter(group => group.roles.includes(userRole || 'viewer'))
    .map(group => ({
      ...group,
      items: group.items.filter(item => item.roles.includes(userRole || 'viewer')),
    }))
    .filter(group => group.items.length > 0);

  const isActive = (href: string) => {
    if (href.includes('?')) {
      return location.pathname + location.search === href;
    }
    return location.pathname === href;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="h-16 border-b border-border px-4 flex flex-row items-center gap-3">
          <ZenithLogo size={28} />
          <div className="flex flex-col">
            <SheetTitle className="text-sm font-semibold text-left">
              {tenant?.name || 'Zenith'}
            </SheetTitle>
            <span className="text-xs text-muted-foreground capitalize">
              {userRole === 'tenant_admin' ? 'Admin' : userRole}
            </span>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-6">
            {filteredNavigation.map((group) => (
              <div key={group.title}>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
                  {group.title}
                </h3>
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const active = isActive(item.href);
                    const ItemIcon = item.icon;

                    return (
                      <li key={item.href}>
                        <Link
                          to={item.href}
                          onClick={() => onOpenChange(false)}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                            'hover:bg-accent hover:text-accent-foreground',
                            active
                              ? 'bg-primary text-primary-foreground font-medium'
                              : 'text-foreground'
                          )}
                        >
                          <ItemIcon
                            size={18}
                            className={cn(active ? '' : 'text-muted-foreground')}
                          />
                          <span className="flex-1">{item.label}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            {/* Settings Link */}
            <div className="pt-4 border-t border-border">
              <Link
                to="/admin/settings"
                onClick={() => onOpenChange(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-foreground hover:bg-accent transition-colors"
              >
                <Settings size={18} className="text-muted-foreground" />
                <span>Settings</span>
              </Link>
            </div>
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default AdminMobileDrawer;