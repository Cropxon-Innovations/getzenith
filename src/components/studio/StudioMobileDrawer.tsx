import { useParams, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Palette,
  Globe,
  GraduationCap,
  Zap,
  Settings,
  Users,
  BarChart3,
  FolderOpen,
  Layers,
  Image,
  Video,
  Calendar,
  MessageSquare,
  Bell,
  X,
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ZenithLogo } from '../ZenithLogo';
import { cn } from '@/lib/utils';

interface StudioMobileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const studioNavigation: Record<string, NavGroup[]> = {
  cms: [
    {
      title: 'Content',
      items: [
        { icon: LayoutDashboard, label: 'Overview', href: '/studio/cms' },
        { icon: FileText, label: 'Articles', href: '/studio/cms/articles' },
        { icon: FolderOpen, label: 'Collections', href: '/studio/cms/collections' },
        { icon: Image, label: 'Media Library', href: '/studio/cms/media' },
      ],
    },
    {
      title: 'Structure',
      items: [
        { icon: Layers, label: 'Content Types', href: '/studio/cms/types' },
        { icon: Settings, label: 'Settings', href: '/studio/cms/settings' },
      ],
    },
  ],
  canvas: [
    {
      title: 'Design',
      items: [
        { icon: LayoutDashboard, label: 'Overview', href: '/studio/canvas' },
        { icon: Palette, label: 'Templates', href: '/studio/canvas/templates' },
        { icon: Layers, label: 'Components', href: '/studio/canvas/components' },
        { icon: Image, label: 'Assets', href: '/studio/canvas/assets' },
      ],
    },
  ],
  website: [
    {
      title: 'Site',
      items: [
        { icon: LayoutDashboard, label: 'Overview', href: '/studio/website' },
        { icon: FileText, label: 'Pages', href: '/studio/website/pages' },
        { icon: Globe, label: 'Domains', href: '/studio/website/domains' },
        { icon: BarChart3, label: 'Analytics', href: '/studio/website/analytics' },
      ],
    },
  ],
  lms: [
    {
      title: 'Learning',
      items: [
        { icon: LayoutDashboard, label: 'Overview', href: '/studio/lms' },
        { icon: GraduationCap, label: 'Courses', href: '/studio/lms/courses' },
        { icon: Video, label: 'Lessons', href: '/studio/lms/lessons' },
        { icon: Users, label: 'Students', href: '/studio/lms/students' },
      ],
    },
    {
      title: 'Engage',
      items: [
        { icon: Calendar, label: 'Live Sessions', href: '/studio/lms/sessions' },
        { icon: BarChart3, label: 'Progress', href: '/studio/lms/progress' },
      ],
    },
  ],
  automation: [
    {
      title: 'Automate',
      items: [
        { icon: LayoutDashboard, label: 'Overview', href: '/studio/automation' },
        { icon: Zap, label: 'Workflows', href: '/studio/automation/workflows' },
        { icon: Bell, label: 'Triggers', href: '/studio/automation/triggers' },
        { icon: MessageSquare, label: 'Actions', href: '/studio/automation/actions' },
      ],
    },
  ],
};

const studioMeta: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  cms: { icon: FileText, label: 'CMS Studio', color: 'text-blue-500' },
  canvas: { icon: Palette, label: 'Canvas Studio', color: 'text-purple-500' },
  website: { icon: Globe, label: 'Website Studio', color: 'text-green-500' },
  lms: { icon: GraduationCap, label: 'LMS Studio', color: 'text-orange-500' },
  automation: { icon: Zap, label: 'Automation Studio', color: 'text-yellow-500' },
};

export const StudioMobileDrawer = ({ open, onOpenChange }: StudioMobileDrawerProps) => {
  const { studioType = 'cms' } = useParams();
  const navigation = studioNavigation[studioType] || studioNavigation.cms;
  const meta = studioMeta[studioType] || studioMeta.cms;
  const StudioIcon = meta.icon;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="h-16 border-b border-border flex flex-row items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <ZenithLogo size={28} />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Studio</span>
              <SheetTitle className="text-sm font-semibold flex items-center gap-1.5 m-0">
                <StudioIcon size={14} className={meta.color} />
                {meta.label.replace(' Studio', '')}
              </SheetTitle>
            </div>
          </div>
        </SheetHeader>

        <nav className="flex-1 overflow-y-auto py-4">
          {navigation.map((group) => (
            <div key={group.title} className="mb-6">
              <div className="px-4 mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {group.title}
                </span>
              </div>
              
              <ul className="space-y-1 px-2">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <NavLink
                      to={item.href}
                      onClick={() => onOpenChange(false)}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                          'hover:bg-secondary/80',
                          isActive
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'text-muted-foreground hover:text-foreground'
                        )
                      }
                    >
                      <item.icon size={20} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Studio Switcher */}
        <div className="border-t border-border p-3">
          <div className="grid grid-cols-5 gap-1">
            {Object.entries(studioMeta).map(([key, { icon: Icon, color }]) => (
              <NavLink
                key={key}
                to={`/studio/${key}`}
                onClick={() => onOpenChange(false)}
                className={({ isActive }) =>
                  cn(
                    'p-2 rounded-md flex items-center justify-center transition-all',
                    'hover:bg-secondary',
                    isActive ? 'bg-primary/10 border border-primary/20' : ''
                  )
                }
              >
                <Icon size={18} className={color} />
              </NavLink>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
