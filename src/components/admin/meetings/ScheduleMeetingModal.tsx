import { useState } from 'react';
import { format, addHours } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Users, Video, X, Send, Mail, Phone, AlertTriangle } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useMeetings } from '@/hooks/useMeetings';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

const PLAN_LIMITS: Record<string, number> = {
  free: 2,
  pro: 100,
  enterprise: 100,
};

interface ScheduleMeetingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const durationOptions = [
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '45', label: '45 minutes' },
  { value: '60', label: '1 hour' },
  { value: '90', label: '1.5 hours' },
  { value: '120', label: '2 hours' },
];

const timeSlots = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return {
    value: `${hour.toString().padStart(2, '0')}:${minute}`,
    label: `${displayHour}:${minute} ${period}`,
  };
});

export const ScheduleMeetingModal = ({
  open,
  onOpenChange,
  onSuccess,
}: ScheduleMeetingModalProps) => {
  const { toast } = useToast();
  const { createMeeting } = useMeetings();
  const { tenant, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date(),
    time: '10:00',
    duration: '60',
    participantEmails: [] as string[],
    newEmail: '',
  });

  const tenantPlan = tenant?.plan || 'free';
  const participantLimit = PLAN_LIMITS[tenantPlan] || 2;
  const isOverLimit = formData.participantEmails.length >= participantLimit;

  const handleAddParticipant = () => {
    const email = formData.newEmail.trim();
    if (!email) return;

    if (formData.participantEmails.length >= participantLimit) {
      toast({
        title: 'Participant Limit Reached',
        description: `Your ${tenantPlan} plan allows up to ${participantLimit} participants. Contact CropXon/Zenith team for more.`,
        variant: 'destructive',
      });
      return;
    }

    if (!formData.participantEmails.includes(email)) {
      setFormData({
        ...formData,
        participantEmails: [...formData.participantEmails, email],
        newEmail: '',
      });
    }
  };

  const handleRemoveParticipant = (email: string) => {
    setFormData({
      ...formData,
      participantEmails: formData.participantEmails.filter((e) => e !== email),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const [hours, minutes] = formData.time.split(':').map(Number);
      const scheduledAt = new Date(formData.date);
      scheduledAt.setHours(hours, minutes, 0, 0);

      const { data, error } = await createMeeting(
        formData.title,
        formData.description,
        scheduledAt,
        parseInt(formData.duration),
        formData.participantEmails
      );

      if (error) throw error;

      // Send invites via edge function
      if (formData.participantEmails.length > 0 && data) {
        const { error: inviteError } = await supabase.functions.invoke('send-meeting-invite', {
          body: {
            meetingId: data.id,
            meetingTitle: formData.title,
            meetingLink: data.meeting_link,
            scheduledAt: scheduledAt.toISOString(),
            durationMinutes: parseInt(formData.duration),
            hostName: profile?.full_name || 'Host',
            participants: formData.participantEmails,
            tenantPlan: tenantPlan,
          },
        });

        if (inviteError) {
          console.error('Failed to send invites:', inviteError);
        } else {
          toast({
            title: 'Invites Sent',
            description: `Invitations sent to ${formData.participantEmails.length} participants`,
          });
        }
      }

      toast({
        title: 'Meeting Scheduled',
        description: `"${formData.title}" has been scheduled for ${format(scheduledAt, 'PPp')}`,
      });

      setFormData({
        title: '',
        description: '',
        date: new Date(),
        time: '10:00',
        duration: '60',
        participantEmails: [],
        newEmail: '',
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to schedule meeting',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video size={20} className="text-primary" />
            Schedule Meeting
          </DialogTitle>
          <DialogDescription>
            Create a new video meeting and invite participants
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Meeting Title *</Label>
            <Input
              id="title"
              placeholder="Weekly Team Sync"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add meeting agenda or notes..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !formData.date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon size={16} className="mr-2" />
                    {formData.date ? format(formData.date, 'PP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => date && setFormData({ ...formData, date })}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Time *</Label>
              <Select
                value={formData.time}
                onValueChange={(value) => setFormData({ ...formData, time: value })}
              >
                <SelectTrigger>
                  <Clock size={16} className="mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot.value} value={slot.value}>
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Duration</Label>
            <Select
              value={formData.duration}
              onValueChange={(value) => setFormData({ ...formData, duration: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {durationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Invite Participants (by email or phone)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="email@company.com or +1234567890"
                value={formData.newEmail}
                onChange={(e) => setFormData({ ...formData, newEmail: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddParticipant();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={handleAddParticipant}>
                Add
              </Button>
            </div>
            {formData.participantEmails.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.participantEmails.map((email) => (
                  <Badge key={email} variant="secondary" className="gap-1">
                    {email.includes('@') ? (
                      <Mail size={12} />
                    ) : (
                      <Phone size={12} />
                    )}
                    {email}
                    <button
                      type="button"
                      onClick={() => handleRemoveParticipant(email)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.title}>
              {isLoading ? (
                'Scheduling...'
              ) : (
                <>
                  <Send size={16} className="mr-2" />
                  Schedule Meeting
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
