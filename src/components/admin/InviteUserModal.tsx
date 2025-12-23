import { useState } from 'react';
import { Mail, Phone, MessageSquare, Send, UserPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth, AppRole } from '@/contexts/AuthContext';

interface InviteUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

type NotificationMethod = 'email' | 'phone' | 'internal';

export const InviteUserModal = ({ open, onOpenChange, onSuccess }: InviteUserModalProps) => {
  const { user, tenant } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    role: 'viewer' as AppRole,
    notificationMethod: 'email' as NotificationMethod,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !tenant) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.from('team_invitations').insert({
        tenant_id: tenant.id,
        email: formData.email,
        phone: formData.phone || null,
        role: formData.role,
        invited_by: user.id,
        notification_method: formData.notificationMethod,
      });

      if (error) throw error;

      // Create notification for admin
      await supabase.from('notifications').insert({
        tenant_id: tenant.id,
        user_id: user.id,
        type: 'team',
        title: 'Invitation Sent',
        message: `Invitation sent to ${formData.email} as ${formData.role}`,
      });

      toast({
        title: 'Invitation Sent',
        description: `An invitation has been sent to ${formData.email}`,
      });

      setFormData({ email: '', phone: '', role: 'viewer', notificationMethod: 'email' });
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send invitation',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus size={20} />
            Invite Team Member
          </DialogTitle>
          <DialogDescription>
            Send an invitation to add a new member to your team
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="colleague@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value: AppRole) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Viewer - Can view content</SelectItem>
                <SelectItem value="editor">Editor - Can create and edit content</SelectItem>
                <SelectItem value="mentor">Mentor - Can manage learners</SelectItem>
                <SelectItem value="tenant_admin">Admin - Full access</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Send Invitation Via</Label>
            <RadioGroup
              value={formData.notificationMethod}
              onValueChange={(value: NotificationMethod) =>
                setFormData({ ...formData, notificationMethod: value })
              }
              className="grid grid-cols-3 gap-2"
            >
              <Label
                htmlFor="method-email"
                className={`flex flex-col items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                  formData.notificationMethod === 'email'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value="email" id="method-email" className="sr-only" />
                <Mail size={20} className={formData.notificationMethod === 'email' ? 'text-primary' : 'text-muted-foreground'} />
                <span className="text-xs font-medium">Email</span>
              </Label>

              <Label
                htmlFor="method-phone"
                className={`flex flex-col items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                  formData.notificationMethod === 'phone'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value="phone" id="method-phone" className="sr-only" />
                <Phone size={20} className={formData.notificationMethod === 'phone' ? 'text-primary' : 'text-muted-foreground'} />
                <span className="text-xs font-medium">SMS</span>
              </Label>

              <Label
                htmlFor="method-internal"
                className={`flex flex-col items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                  formData.notificationMethod === 'internal'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value="internal" id="method-internal" className="sr-only" />
                <MessageSquare size={20} className={formData.notificationMethod === 'internal' ? 'text-primary' : 'text-muted-foreground'} />
                <span className="text-xs font-medium">Internal</span>
              </Label>
            </RadioGroup>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                'Sending...'
              ) : (
                <>
                  <Send size={16} className="mr-2" />
                  Send Invitation
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
