import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  UserPlus,
  Shield,
  Mail,
  MoreHorizontal,
  Search,
  Crown,
  Edit,
  Trash2,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuth, AppRole } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Mock team members data
const teamMembers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'tenant_admin' as AppRole,
    status: 'active',
    avatar: null,
    joinedAt: '2024-01-15',
    lastActive: '2 hours ago',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'editor' as AppRole,
    status: 'active',
    avatar: null,
    joinedAt: '2024-02-20',
    lastActive: '1 day ago',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'mentor' as AppRole,
    status: 'active',
    avatar: null,
    joinedAt: '2024-03-10',
    lastActive: '5 minutes ago',
  },
];

const pendingInvites = [
  {
    id: '1',
    email: 'sarah@example.com',
    role: 'editor' as AppRole,
    sentAt: '2024-06-15',
    expiresAt: '2024-06-22',
  },
  {
    id: '2',
    email: 'tom@example.com',
    role: 'viewer' as AppRole,
    sentAt: '2024-06-18',
    expiresAt: '2024-06-25',
  },
];

const roleConfig = {
  tenant_admin: {
    label: 'Admin',
    description: 'Full access to all features and settings',
    color: 'bg-primary/10 text-primary',
    icon: Crown,
  },
  editor: {
    label: 'Editor',
    description: 'Create and edit content, manage media',
    color: 'bg-blue-500/10 text-blue-500',
    icon: Edit,
  },
  mentor: {
    label: 'Mentor',
    description: 'Manage courses and students',
    color: 'bg-green-500/10 text-green-500',
    icon: Users,
  },
  viewer: {
    label: 'Viewer',
    description: 'View-only access to content',
    color: 'bg-gray-500/10 text-gray-500',
    icon: Shield,
  },
};

export default function TeamManagement() {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<AppRole>('editor');
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendInvite = () => {
    if (!inviteEmail) return;
    
    toast({
      title: 'Invitation Sent',
      description: `Invitation sent to ${inviteEmail}`,
    });
    setInviteEmail('');
    setIsInviteDialogOpen(false);
  };

  const handleResendInvite = (email: string) => {
    toast({
      title: 'Invitation Resent',
      description: `Invitation resent to ${email}`,
    });
  };

  const handleRevokeInvite = (email: string) => {
    toast({
      title: 'Invitation Revoked',
      description: `Invitation to ${email} has been revoked`,
    });
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Team Management</h1>
            <p className="text-muted-foreground">Manage your team members and their access</p>
          </div>
          <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus size={16} className="mr-2" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to join your workspace
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="colleague@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as AppRole)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <config.icon size={14} />
                            <span>{config.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {roleConfig[inviteRole].description}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendInvite}>
                  <Send size={16} className="mr-2" />
                  Send Invitation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Members', value: teamMembers.length, icon: Users, color: 'text-blue-500' },
            { label: 'Admins', value: teamMembers.filter(m => m.role === 'tenant_admin').length, icon: Crown, color: 'text-primary' },
            { label: 'Pending Invites', value: pendingInvites.length, icon: Mail, color: 'text-orange-500' },
            { label: 'Active Now', value: 2, icon: CheckCircle, color: 'text-green-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center`}>
                      <stat.icon size={20} className={stat.color} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="members" className="space-y-6">
          <TabsList>
            <TabsTrigger value="members">Team Members</TabsTrigger>
            <TabsTrigger value="invites">Pending Invites</TabsTrigger>
            <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          </TabsList>

          {/* Team Members Tab */}
          <TabsContent value="members" className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter size={16} />
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {filteredMembers.map((member, index) => {
                    const roleInfo = roleConfig[member.role];
                    return (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-medium">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <Badge className={roleInfo.color}>
                            <roleInfo.icon size={12} className="mr-1" />
                            {roleInfo.label}
                          </Badge>
                          <span className="text-sm text-muted-foreground hidden sm:block">
                            {member.lastActive}
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit size={14} className="mr-2" />
                                Edit Role
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail size={14} className="mr-2" />
                                Send Message
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 size={14} className="mr-2" />
                                Remove Member
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Invites Tab */}
          <TabsContent value="invites" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Invitations</CardTitle>
                <CardDescription>Invitations awaiting acceptance</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingInvites.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Mail size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No pending invitations</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingInvites.map((invite) => {
                      const roleInfo = roleConfig[invite.role];
                      return (
                        <div
                          key={invite.id}
                          className="flex items-center justify-between p-4 rounded-lg border border-border"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                              <Clock size={20} className="text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{invite.email}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>Sent {invite.sentAt}</span>
                                <span>•</span>
                                <span>Expires {invite.expiresAt}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={roleInfo.color}>{roleInfo.label}</Badge>
                            <Button variant="outline" size="sm" onClick={() => handleResendInvite(invite.email)}>
                              <Send size={14} className="mr-2" />
                              Resend
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleRevokeInvite(invite.email)}>
                              <XCircle size={14} className="mr-2" />
                              Revoke
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roles & Permissions Tab */}
          <TabsContent value="roles" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(roleConfig).map(([key, config], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center`}>
                          <config.icon size={20} />
                        </div>
                        <div>
                          <CardTitle className="text-base">{config.label}</CardTitle>
                          <CardDescription>{config.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        {key === 'tenant_admin' && (
                          <>
                            <div className="flex items-center gap-2 text-green-500">
                              <CheckCircle size={14} /> Full platform access
                            </div>
                            <div className="flex items-center gap-2 text-green-500">
                              <CheckCircle size={14} /> Manage team & billing
                            </div>
                            <div className="flex items-center gap-2 text-green-500">
                              <CheckCircle size={14} /> Configure integrations
                            </div>
                          </>
                        )}
                        {key === 'editor' && (
                          <>
                            <div className="flex items-center gap-2 text-green-500">
                              <CheckCircle size={14} /> Create & edit content
                            </div>
                            <div className="flex items-center gap-2 text-green-500">
                              <CheckCircle size={14} /> Manage media library
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <XCircle size={14} /> No billing access
                            </div>
                          </>
                        )}
                        {key === 'mentor' && (
                          <>
                            <div className="flex items-center gap-2 text-green-500">
                              <CheckCircle size={14} /> Manage courses
                            </div>
                            <div className="flex items-center gap-2 text-green-500">
                              <CheckCircle size={14} /> View student progress
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <XCircle size={14} /> No content publishing
                            </div>
                          </>
                        )}
                        {key === 'viewer' && (
                          <>
                            <div className="flex items-center gap-2 text-green-500">
                              <CheckCircle size={14} /> View published content
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <XCircle size={14} /> No editing access
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <XCircle size={14} /> No admin features
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}