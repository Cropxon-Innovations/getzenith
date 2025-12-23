import { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MeetingTranscriptProps {
  meetingId: string;
  recordingUrl?: string | null;
  existingTranscript?: string | null;
}

export const MeetingTranscript = ({ 
  meetingId, 
  recordingUrl,
  existingTranscript 
}: MeetingTranscriptProps) => {
  const { toast } = useToast();
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(existingTranscript || null);
  const [showTranscript, setShowTranscript] = useState(false);

  const handleTranscribe = async () => {
    if (!recordingUrl) {
      toast({
        title: 'No Recording Available',
        description: 'This meeting has no recording to transcribe.',
        variant: 'destructive',
      });
      return;
    }

    setIsTranscribing(true);

    try {
      // Fetch the audio file
      const response = await fetch(recordingUrl);
      const audioBlob = await response.blob();

      // Create form data for the edge function
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('meetingId', meetingId);

      // Call the transcription edge function
      const { data, error } = await supabase.functions.invoke('transcribe-meeting', {
        body: formData,
      });

      if (error) throw error;

      setTranscript(data.transcript);
      setShowTranscript(true);

      toast({
        title: 'Transcription Complete',
        description: 'Meeting transcript has been generated.',
      });
    } catch (error) {
      console.error('Transcription error:', error);
      toast({
        title: 'Transcription Failed',
        description: 'Could not transcribe the meeting recording.',
        variant: 'destructive',
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleCopyTranscript = () => {
    if (transcript) {
      navigator.clipboard.writeText(transcript);
      toast({
        title: 'Copied',
        description: 'Transcript copied to clipboard.',
      });
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={transcript ? () => setShowTranscript(true) : handleTranscribe}
        disabled={isTranscribing || !recordingUrl}
      >
        {isTranscribing ? (
          <>
            <Loader2 size={14} className="mr-1 animate-spin" />
            Transcribing...
          </>
        ) : (
          <>
            <FileText size={14} className="mr-1" />
            {transcript ? 'View Transcript' : 'Generate Transcript'}
          </>
        )}
      </Button>

      <Dialog open={showTranscript} onOpenChange={setShowTranscript}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Meeting Transcript</DialogTitle>
            <DialogDescription>
              AI-generated transcript of the meeting recording
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] rounded-md border p-4">
            <div className="whitespace-pre-wrap text-sm">
              {transcript || 'No transcript available.'}
            </div>
          </ScrollArea>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCopyTranscript}>
              Copy Transcript
            </Button>
            <Button onClick={() => setShowTranscript(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
