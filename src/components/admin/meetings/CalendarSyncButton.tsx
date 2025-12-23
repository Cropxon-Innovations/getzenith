import { useState } from 'react';
import { addMinutes } from 'date-fns';
import { Calendar, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCalendarSync } from '@/hooks/useCalendarSync';
import { useToast } from '@/hooks/use-toast';

interface Meeting {
  id: string;
  title: string;
  description?: string | null;
  scheduled_at: string | null;
  duration_minutes: number;
  meeting_link?: string | null;
}

interface CalendarSyncButtonProps {
  meeting: Meeting;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const CalendarSyncButton = ({ 
  meeting, 
  variant = 'outline',
  size = 'sm' 
}: CalendarSyncButtonProps) => {
  const { addToGoogleCalendar, addToOutlookCalendar, downloadICS } = useCalendarSync();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  if (!meeting.scheduled_at) return null;

  const startDate = new Date(meeting.scheduled_at);
  const endDate = addMinutes(startDate, meeting.duration_minutes);

  const calendarEvent = {
    title: meeting.title,
    description: meeting.description || undefined,
    startDate,
    endDate,
    location: meeting.meeting_link || undefined,
  };

  const handleGoogleCalendar = () => {
    setIsLoading(true);
    try {
      addToGoogleCalendar(calendarEvent);
      toast({
        title: 'Google Calendar',
        description: 'Opening Google Calendar to add event...',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOutlookCalendar = () => {
    setIsLoading(true);
    try {
      addToOutlookCalendar(calendarEvent);
      toast({
        title: 'Outlook Calendar',
        description: 'Opening Outlook Calendar to add event...',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadICS = () => {
    setIsLoading(true);
    try {
      downloadICS(calendarEvent);
      toast({
        title: 'Calendar File Downloaded',
        description: 'Import the .ics file into your calendar app.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={isLoading}>
          <Calendar size={14} className="mr-1" />
          Add to Calendar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleGoogleCalendar}>
          <ExternalLink size={14} className="mr-2" />
          Google Calendar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleOutlookCalendar}>
          <ExternalLink size={14} className="mr-2" />
          Outlook Calendar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDownloadICS}>
          <Download size={14} className="mr-2" />
          Download .ics File
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
