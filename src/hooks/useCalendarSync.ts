import { useCallback } from 'react';
import { format } from 'date-fns';

interface CalendarEvent {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  location?: string;
}

export const useCalendarSync = () => {
  // Generate ICS file content
  const generateICS = useCallback((event: CalendarEvent): string => {
    const formatDate = (date: Date) => {
      return format(date, "yyyyMMdd'T'HHmmss");
    };

    const escapeText = (text: string) => {
      return text.replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n');
    };

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Zenith Studio//Meeting//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `DTSTART:${formatDate(event.startDate)}`,
      `DTEND:${formatDate(event.endDate)}`,
      `SUMMARY:${escapeText(event.title)}`,
      event.description ? `DESCRIPTION:${escapeText(event.description)}` : '',
      event.location ? `LOCATION:${escapeText(event.location)}` : '',
      `UID:${crypto.randomUUID()}@zenith.studio`,
      `DTSTAMP:${formatDate(new Date())}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].filter(Boolean).join('\r\n');

    return ics;
  }, []);

  // Download ICS file
  const downloadICS = useCallback((event: CalendarEvent) => {
    const ics = generateICS(event);
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [generateICS]);

  // Generate Google Calendar URL
  const getGoogleCalendarUrl = useCallback((event: CalendarEvent): string => {
    const formatGoogleDate = (date: Date) => {
      return format(date, "yyyyMMdd'T'HHmmss");
    };

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${formatGoogleDate(event.startDate)}/${formatGoogleDate(event.endDate)}`,
      details: event.description || '',
      location: event.location || '',
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }, []);

  // Generate Outlook Calendar URL
  const getOutlookCalendarUrl = useCallback((event: CalendarEvent): string => {
    const params = new URLSearchParams({
      path: '/calendar/action/compose',
      rru: 'addevent',
      subject: event.title,
      startdt: event.startDate.toISOString(),
      enddt: event.endDate.toISOString(),
      body: event.description || '',
      location: event.location || '',
    });

    return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`;
  }, []);

  // Open calendar in new tab
  const addToGoogleCalendar = useCallback((event: CalendarEvent) => {
    window.open(getGoogleCalendarUrl(event), '_blank');
  }, [getGoogleCalendarUrl]);

  const addToOutlookCalendar = useCallback((event: CalendarEvent) => {
    window.open(getOutlookCalendarUrl(event), '_blank');
  }, [getOutlookCalendarUrl]);

  // Add to Apple Calendar (downloads ICS)
  const addToAppleCalendar = useCallback((event: CalendarEvent) => {
    downloadICS(event);
  }, [downloadICS]);

  return {
    generateICS,
    downloadICS,
    getGoogleCalendarUrl,
    getOutlookCalendarUrl,
    addToGoogleCalendar,
    addToOutlookCalendar,
    addToAppleCalendar,
  };
};
