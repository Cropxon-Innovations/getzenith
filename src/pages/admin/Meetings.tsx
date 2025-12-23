import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isTomorrow, isPast, addMinutes } from 'date-fns';
import {
  Video,
  Plus,
  Calendar,
  Clock,
  Users,
  MoreVertical,
  Play,
  Trash2,
  Copy,
  ExternalLink,
  Crown,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMeetings, Meeting } from '@/hooks/useMeetings';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { useToast } from '@/hooks/use-toast';
import { ScheduleMeetingModal } from '@/components/admin/meetings/ScheduleMeetingModal';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

const getDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  return format(date, 'EEEE, MMM d');
};

const MeetingCard = ({
  meeting,
  onJoin,
  onDelete,
  onCopyLink,
}: {
  meeting: Meeting;
  onJoin: () => void;
  onDelete: () => void;
  onCopyLink: () => void;
}) => {
  const scheduledDate = meeting.scheduled_at ? new Date(meeting.scheduled_at) : null;
  const endTime = scheduledDate
    ? addMinutes(scheduledDate, meeting.duration_minutes)
    : null;
  const isUpcoming = scheduledDate && !isPast(scheduledDate);
  const isLive =
    scheduledDate &&
    isPast(scheduledDate) &&
    endTime &&
    !isPast(endTime);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Card className={`transition-all hover:shadow-md ${isLive ? 'border-green-500/50 bg-green-500/5' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isLive
                  ? 'bg-green-500/20'
                  : isUpcoming
                  ? 'bg-primary/10'
                  : 'bg-muted'
              }`}
            >
              <Video
                size={24}
                className={
                  isLive
                    ? 'text-green-500'
                    : isUpcoming
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-foreground truncate">
                    {meeting.title}
                  </h4>
                  {meeting.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                      {meeting.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {isLive && (
                    <Badge className="bg-green-500 text-white animate-pulse">
                      Live
                    </Badge>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={onCopyLink}>
                        <Copy size={14} className="mr-2" />
                        Copy Link
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onJoin}>
                        <ExternalLink size={14} className="mr-2" />
                        Open Meeting
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={onDelete}
                        className="text-destructive"
                      >
                        <Trash2 size={14} className="mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                {scheduledDate && (
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {format(scheduledDate, 'h:mm a')} -{' '}
                    {endTime && format(endTime, 'h:mm a')}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  {meeting.participants.length + 1} participants
                </div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={meeting.host?.avatar_url} />
                    <AvatarFallback className="text-xs">
                      {meeting.host?.full_name?.charAt(0) || 'H'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    Hosted by {meeting.host?.full_name || 'You'}
                  </span>
                </div>

                {(isLive || isUpcoming) && (
                  <Button size="sm" onClick={onJoin}>
                    <Play size={14} className="mr-1" />
                    {isLive ? 'Join Now' : 'Join'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function Meetings() {
  const { meetings, isLoading, deleteMeeting } = useMeetings();
  const { canScheduleMeetings } = useRoleAccess();
  const { toast } = useToast();
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Group meetings by date
  const upcomingMeetings = meetings.filter(
    (m) => m.scheduled_at && !isPast(addMinutes(new Date(m.scheduled_at), m.duration_minutes))
  );
  const pastMeetings = meetings.filter(
    (m) => m.scheduled_at && isPast(addMinutes(new Date(m.scheduled_at), m.duration_minutes))
  );

  const meetingsByDate = upcomingMeetings.reduce((acc, meeting) => {
    if (!meeting.scheduled_at) return acc;
    const dateKey = format(new Date(meeting.scheduled_at), 'yyyy-MM-dd');
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(meeting);
    return acc;
  }, {} as Record<string, Meeting[]>);

  const handleJoin = (meeting: Meeting) => {
    if (meeting.meeting_link) {
      window.open(meeting.meeting_link, '_blank');
    } else {
      toast({
        title: 'Meeting Link Not Available',
        description: 'The meeting link is not ready yet.',
        variant: 'destructive',
      });
    }
  };

  const handleCopyLink = (meeting: Meeting) => {
    if (meeting.meeting_link) {
      navigator.clipboard.writeText(meeting.meeting_link);
      toast({
        title: 'Link Copied',
        description: 'Meeting link copied to clipboard',
      });
    }
  };

  const handleDelete = async (meeting: Meeting) => {
    const { error } = await deleteMeeting(meeting.id);
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete meeting',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Meeting Deleted',
        description: `"${meeting.title}" has been deleted`,
      });
    }
  };

  // Enterprise plan check
  if (!canScheduleMeetings) {
    return (
      <AdminLayout>
        <div className="h-full flex items-center justify-center p-8">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Crown size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Enterprise Feature</h3>
              <p className="text-muted-foreground mb-4">
                Video meetings with calendar integration are available exclusively for
                Enterprise plan subscribers.
              </p>
              <Button>Upgrade to Enterprise</Button>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Meetings</h1>
            <p className="text-muted-foreground">
              Schedule and manage video meetings with your team
            </p>
          </div>
          <Button onClick={() => setShowScheduleModal(true)}>
            <Plus size={16} className="mr-2" />
            Schedule Meeting
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Meetings List */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="upcoming">
              <TabsList>
                <TabsTrigger value="upcoming">
                  Upcoming ({upcomingMeetings.length})
                </TabsTrigger>
                <TabsTrigger value="past">
                  Past ({pastMeetings.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-6 mt-4">
                {Object.keys(meetingsByDate).length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Video size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No Upcoming Meetings</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Schedule your first meeting to get started
                      </p>
                      <Button onClick={() => setShowScheduleModal(true)}>
                        <Plus size={16} className="mr-2" />
                        Schedule Meeting
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  Object.entries(meetingsByDate)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([date, dayMeetings]) => (
                      <div key={date}>
                        <h3 className="text-sm font-medium text-muted-foreground mb-3">
                          {getDateLabel(date)}
                        </h3>
                        <div className="space-y-3">
                          {dayMeetings.map((meeting) => (
                            <MeetingCard
                              key={meeting.id}
                              meeting={meeting}
                              onJoin={() => handleJoin(meeting)}
                              onDelete={() => handleDelete(meeting)}
                              onCopyLink={() => handleCopyLink(meeting)}
                            />
                          ))}
                        </div>
                      </div>
                    ))
                )}
              </TabsContent>

              <TabsContent value="past" className="space-y-3 mt-4">
                {pastMeetings.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                      No past meetings
                    </CardContent>
                  </Card>
                ) : (
                  pastMeetings.map((meeting) => (
                    <MeetingCard
                      key={meeting.id}
                      meeting={meeting}
                      onJoin={() => handleJoin(meeting)}
                      onDelete={() => handleDelete(meeting)}
                      onCopyLink={() => handleCopyLink(meeting)}
                    />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Calendar Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar size={18} className="text-primary" />
                  Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md"
                  modifiers={{
                    hasMeeting: upcomingMeetings
                      .filter((m) => m.scheduled_at)
                      .map((m) => new Date(m.scheduled_at!)),
                  }}
                  modifiersStyles={{
                    hasMeeting: {
                      backgroundColor: 'hsl(var(--primary) / 0.1)',
                      borderRadius: '50%',
                    },
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Today's Meetings</span>
                  <span className="font-semibold">
                    {upcomingMeetings.filter((m) => m.scheduled_at && isToday(new Date(m.scheduled_at))).length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">This Week</span>
                  <span className="font-semibold">{upcomingMeetings.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Meetings</span>
                  <span className="font-semibold">{meetings.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ScheduleMeetingModal
        open={showScheduleModal}
        onOpenChange={setShowScheduleModal}
      />
    </AdminLayout>
  );
}
