import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  BellRing,
  Check,
  CheckCheck,
  Trash2,
  Settings,
  Filter,
  Users,
  FileText,
  AlertTriangle,
  Info,
  Shield,
  Zap,
  Calendar,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Clock,
  X,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type NotificationType = 'team' | 'content' | 'system' | 'security';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actor?: {
    name: string;
    avatar?: string;
  };
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'team',
    title: 'New Team Member',
    message: 'Jane Smith has joined the workspace as an Editor',
    timestamp: '5 minutes ago',
    read: false,
    actor: { name: 'Jane Smith' },
  },
  {
    id: '2',
    type: 'content',
    title: 'Content Published',
    message: 'The article "Getting Started Guide" has been published successfully',
    timestamp: '15 minutes ago',
    read: false,
  },
  {
    id: '3',
    type: 'system',
    title: 'System Update',
    message: 'A new version of the platform is available. See what\'s new.',
    timestamp: '1 hour ago',
    read: false,
  },
  {
    id: '4',
    type: 'security',
    title: 'Login from New Device',
    message: 'A new login was detected from Chrome on macOS',
    timestamp: '2 hours ago',
    read: true,
  },
  {
    id: '5',
    type: 'team',
    title: 'Role Updated',
    message: 'Mike Johnson\'s role has been changed from Viewer to Editor',
    timestamp: '3 hours ago',
    read: true,
    actor: { name: 'Admin' },
  },
  {
    id: '6',
    type: 'content',
    title: 'Content Scheduled',
    message: 'Course "Advanced Marketing" scheduled for release on July 15',
    timestamp: '5 hours ago',
    read: true,
  },
  {
    id: '7',
    type: 'system',
    title: 'Backup Completed',
    message: 'Your daily backup has been completed successfully',
    timestamp: '1 day ago',
    read: true,
  },
  {
    id: '8',
    type: 'security',
    title: 'Password Changed',
    message: 'Your account password was successfully changed',
    timestamp: '2 days ago',
    read: true,
  },
];

const notificationConfig = {
  team: {
    icon: Users,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    label: 'Team Activity',
  },
  content: {
    icon: FileText,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    label: 'Content Updates',
  },
  system: {
    icon: Zap,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    label: 'System',
  },
  security: {
    icon: Shield,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    label: 'Security',
  },
};

const notificationPreferences = [
  { id: 'email_team', label: 'Team activity', description: 'New members, role changes', category: 'Email' },
  { id: 'email_content', label: 'Content updates', description: 'Publishing, scheduling', category: 'Email' },
  { id: 'email_system', label: 'System updates', description: 'Platform updates, maintenance', category: 'Email' },
  { id: 'email_security', label: 'Security alerts', description: 'Login attempts, password changes', category: 'Email' },
  { id: 'push_team', label: 'Team activity', description: 'Real-time team notifications', category: 'Push' },
  { id: 'push_content', label: 'Content updates', description: 'Real-time content alerts', category: 'Push' },
  { id: 'push_security', label: 'Security alerts', description: 'Immediate security notifications', category: 'Push' },
];

export default function Notifications() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | NotificationType>('all');
  const [preferences, setPreferences] = useState<Record<string, boolean>>({
    email_team: true,
    email_content: true,
    email_system: false,
    email_security: true,
    push_team: true,
    push_content: false,
    push_security: true,
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast({ title: 'All notifications marked as read' });
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast({ title: 'Notification deleted' });
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast({ title: 'All notifications cleared' });
  };

  const togglePreference = (id: string) => {
    setPreferences(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <BellRing size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
              <p className="text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
              <CheckCheck size={16} className="mr-2" />
              Mark All Read
            </Button>
            <Button variant="outline" onClick={handleClearAll} disabled={notifications.length === 0}>
              <Trash2 size={16} className="mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="inbox" className="space-y-6">
          <TabsList>
            <TabsTrigger value="inbox" className="gap-2">
              <Bell size={16} />
              Inbox
              {unreadCount > 0 && (
                <Badge variant="secondary" className="bg-primary text-primary-foreground ml-1">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings size={16} />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Inbox Tab */}
          <TabsContent value="inbox" className="space-y-4">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              {Object.entries(notificationConfig).map(([key, config]) => (
                <Button
                  key={key}
                  variant={filter === key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(key as NotificationType)}
                  className="gap-2"
                >
                  <config.icon size={14} />
                  {config.label}
                </Button>
              ))}
            </div>

            {/* Notifications List */}
            <Card>
              <CardContent className="p-0">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No notifications to show</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    <AnimatePresence>
                      {filteredNotifications.map((notification, index) => {
                        const config = notificationConfig[notification.type];
                        return (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ delay: index * 0.03 }}
                            className={`flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors ${
                              !notification.read ? 'bg-primary/5' : ''
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center shrink-0`}>
                              <config.icon size={20} className={config.color} />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className={`font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {notification.title}
                                  </p>
                                  <p className="text-sm text-muted-foreground mt-0.5">
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Clock size={12} className="text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                                    {notification.actor && (
                                      <>
                                        <span className="text-muted-foreground">•</span>
                                        <span className="text-xs text-muted-foreground">by {notification.actor.name}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  {!notification.read && (
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                  )}
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal size={16} />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      {!notification.read && (
                                        <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>
                                          <Check size={14} className="mr-2" />
                                          Mark as read
                                        </DropdownMenuItem>
                                      )}
                                      <DropdownMenuItem 
                                        onClick={() => handleDelete(notification.id)}
                                        className="text-destructive"
                                      >
                                        <Trash2 size={14} className="mr-2" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            {['Email', 'Push'].map((category) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {category === 'Email' ? (
                        <Mail size={20} className="text-primary" />
                      ) : (
                        <BellRing size={20} className="text-primary" />
                      )}
                      {category} Notifications
                    </CardTitle>
                    <CardDescription>
                      {category === 'Email' 
                        ? 'Choose which notifications you receive via email'
                        : 'Choose which notifications appear as push notifications'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {notificationPreferences
                      .filter(p => p.category === category)
                      .map((pref, index) => (
                        <div key={pref.id}>
                          {index > 0 && <Separator className="my-4" />}
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor={pref.id} className="text-base">
                                {pref.label}
                              </Label>
                              <p className="text-sm text-muted-foreground">{pref.description}</p>
                            </div>
                            <Switch
                              id={pref.id}
                              checked={preferences[pref.id] || false}
                              onCheckedChange={() => togglePreference(pref.id)}
                            />
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Quiet Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock size={20} className="text-primary" />
                  Quiet Hours
                </CardTitle>
                <CardDescription>
                  Pause notifications during specific times
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Enable Quiet Hours</Label>
                    <p className="text-sm text-muted-foreground">
                      No notifications from 10:00 PM to 8:00 AM
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
