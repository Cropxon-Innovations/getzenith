import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  Users,
  MessageSquare,
  Monitor,
  Hand,
  Copy,
  Check,
  Circle,
  StopCircle,
  UserPlus,
  UserMinus,
  Clock,
  DoorOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Participant {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  isHost: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  isHandRaised: boolean;
}

interface WaitingParticipant {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  joinedAt: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
}

export default function MeetingRoom() {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  const [isJoined, setIsJoined] = useState(false);
  const [isInWaitingRoom, setIsInWaitingRoom] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [waitingParticipants, setWaitingParticipants] = useState<WaitingParticipant[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [meetingInfo, setMeetingInfo] = useState<any>(null);
  const [isHost, setIsHost] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const channelRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // ICE servers configuration
  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  // Fetch meeting info
  useEffect(() => {
    const fetchMeeting = async () => {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('meeting_link', `${window.location.origin}/meet/${meetingId}`)
        .single();

      if (error) {
        console.error('Meeting not found:', error);
        toast({
          title: 'Meeting Not Found',
          description: 'This meeting link is invalid or has expired.',
          variant: 'destructive',
        });
        return;
      }

      setMeetingInfo(data);
      setIsHost(data.host_id === user?.id);
    };

    fetchMeeting();
  }, [meetingId, toast, user?.id]);

  // Initialize local media
  const initializeMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast({
        title: 'Media Access Error',
        description: 'Could not access camera or microphone. Please check permissions.',
        variant: 'destructive',
      });
      return null;
    }
  }, [toast]);

  // Handle waiting room
  const requestToJoin = async () => {
    if (!meetingInfo?.waiting_room_enabled) {
      await joinMeeting();
      return;
    }

    const stream = await initializeMedia();
    if (!stream) return;

    setIsInWaitingRoom(true);

    // Add to waiting room via realtime
    const channel = supabase.channel(`waiting:${meetingId}`);
    
    channel
      .on('broadcast', { event: 'admitted' }, ({ payload }) => {
        if (payload.participantId === user?.id) {
          setIsInWaitingRoom(false);
          joinMeetingAfterAdmission();
        }
      })
      .on('broadcast', { event: 'denied' }, ({ payload }) => {
        if (payload.participantId === user?.id) {
          toast({
            title: 'Access Denied',
            description: 'The host has denied your request to join.',
            variant: 'destructive',
          });
          setIsInWaitingRoom(false);
          navigate('/admin/meetings');
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.send({
            type: 'broadcast',
            event: 'join-request',
            payload: {
              participantId: user?.id,
              name: profile?.full_name || 'Anonymous',
              email: user?.email || '',
              avatar_url: profile?.avatar_url,
              joinedAt: new Date().toISOString(),
            },
          });
        }
      });
  };

  // Host: admit participant
  const admitParticipant = async (participant: WaitingParticipant) => {
    channelRef.current?.send({
      type: 'broadcast',
      event: 'admitted',
      payload: { participantId: participant.id },
    });
    
    setWaitingParticipants(prev => prev.filter(p => p.id !== participant.id));
    
    toast({
      title: 'Participant Admitted',
      description: `${participant.name} has been admitted to the meeting.`,
    });
  };

  // Host: deny participant
  const denyParticipant = async (participant: WaitingParticipant) => {
    channelRef.current?.send({
      type: 'broadcast',
      event: 'denied',
      payload: { participantId: participant.id },
    });
    
    setWaitingParticipants(prev => prev.filter(p => p.id !== participant.id));
  };

  // Join meeting after admission
  const joinMeetingAfterAdmission = async () => {
    const stream = localStreamRef.current;
    if (!stream) return;

    await setupMeetingChannel(stream);
    setIsJoined(true);
  };

  // Setup meeting channel
  const setupMeetingChannel = async (stream: MediaStream) => {
    const channel = supabase.channel(`meeting:${meetingId}`, {
      config: {
        presence: {
          key: user?.id || crypto.randomUUID(),
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const participantList: Participant[] = [];
        
        Object.entries(state).forEach(([key, presences]: [string, any[]]) => {
          presences.forEach((presence) => {
            participantList.push({
              id: key,
              name: presence.name || 'Anonymous',
              email: presence.email || '',
              avatar_url: presence.avatar_url,
              isHost: presence.isHost || false,
              isMuted: presence.isMuted || false,
              isVideoOff: presence.isVideoOff || false,
              isHandRaised: presence.isHandRaised || false,
            });
          });
        });
        
        setParticipants(participantList);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
        newPresences.forEach((presence: any) => {
          if (presence.user_id !== user?.id) {
            createPeerConnection(presence.user_id, stream);
          }
        });
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
        leftPresences.forEach((presence: any) => {
          const pc = peerConnectionsRef.current.get(presence.user_id);
          if (pc) {
            pc.close();
            peerConnectionsRef.current.delete(presence.user_id);
          }
        });
      })
      .on('broadcast', { event: 'join-request' }, ({ payload }) => {
        if (isHost) {
          setWaitingParticipants(prev => {
            if (prev.some(p => p.id === payload.participantId)) return prev;
            return [...prev, {
              id: payload.participantId,
              name: payload.name,
              email: payload.email,
              avatar_url: payload.avatar_url,
              joinedAt: payload.joinedAt,
            }];
          });
        }
      })
      .on('broadcast', { event: 'offer' }, async ({ payload }) => {
        if (payload.target === user?.id) {
          await handleOffer(payload.offer, payload.from, stream);
        }
      })
      .on('broadcast', { event: 'answer' }, async ({ payload }) => {
        if (payload.target === user?.id) {
          await handleAnswer(payload.answer, payload.from);
        }
      })
      .on('broadcast', { event: 'ice-candidate' }, async ({ payload }) => {
        if (payload.target === user?.id) {
          await handleIceCandidate(payload.candidate, payload.from);
        }
      })
      .on('broadcast', { event: 'chat' }, ({ payload }) => {
        setChatMessages((prev) => [...prev, {
          id: crypto.randomUUID(),
          sender: payload.sender,
          message: payload.message,
          timestamp: new Date(payload.timestamp),
        }]);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: user?.id,
            name: profile?.full_name || 'Anonymous',
            email: user?.email || '',
            avatar_url: profile?.avatar_url,
            isHost: meetingInfo?.host_id === user?.id,
            isMuted,
            isVideoOff,
            isHandRaised,
          });
        }
      });

    channelRef.current = channel;
  };

  // Join meeting (for non-waiting room or host)
  const joinMeeting = async () => {
    const stream = await initializeMedia();
    if (!stream) return;

    await setupMeetingChannel(stream);
    setIsJoined(true);
  };

  // Create peer connection
  const createPeerConnection = async (peerId: string, stream: MediaStream) => {
    const pc = new RTCPeerConnection(iceServers);
    
    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        channelRef.current?.send({
          type: 'broadcast',
          event: 'ice-candidate',
          payload: {
            candidate: event.candidate,
            from: user?.id,
            target: peerId,
          },
        });
      }
    };

    pc.ontrack = (event) => {
      console.log('Remote track received:', event.streams[0]);
    };

    peerConnectionsRef.current.set(peerId, pc);

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    channelRef.current?.send({
      type: 'broadcast',
      event: 'offer',
      payload: {
        offer,
        from: user?.id,
        target: peerId,
      },
    });

    return pc;
  };

  // Handle incoming offer
  const handleOffer = async (offer: RTCSessionDescriptionInit, from: string, stream: MediaStream) => {
    const pc = new RTCPeerConnection(iceServers);
    
    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        channelRef.current?.send({
          type: 'broadcast',
          event: 'ice-candidate',
          payload: {
            candidate: event.candidate,
            from: user?.id,
            target: from,
          },
        });
      }
    };

    pc.ontrack = (event) => {
      console.log('Remote track received:', event.streams[0]);
    };

    peerConnectionsRef.current.set(from, pc);

    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    channelRef.current?.send({
      type: 'broadcast',
      event: 'answer',
      payload: {
        answer,
        from: user?.id,
        target: from,
      },
    });
  };

  // Handle incoming answer
  const handleAnswer = async (answer: RTCSessionDescriptionInit, from: string) => {
    const pc = peerConnectionsRef.current.get(from);
    if (pc) {
      await pc.setRemoteDescription(answer);
    }
  };

  // Handle ICE candidate
  const handleIceCandidate = async (candidate: RTCIceCandidateInit, from: string) => {
    const pc = peerConnectionsRef.current.get(from);
    if (pc) {
      await pc.addIceCandidate(candidate);
    }
  };

  // Toggle controls
  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
      
      channelRef.current?.track({
        user_id: user?.id,
        name: profile?.full_name || 'Anonymous',
        email: user?.email || '',
        isMuted: !isMuted,
        isVideoOff,
        isHandRaised,
      });
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = isVideoOff;
      });
      setIsVideoOff(!isVideoOff);
      
      channelRef.current?.track({
        user_id: user?.id,
        name: profile?.full_name || 'Anonymous',
        email: user?.email || '',
        isMuted,
        isVideoOff: !isVideoOff,
        isHandRaised,
      });
    }
  };

  const toggleHandRaise = () => {
    setIsHandRaised(!isHandRaised);
    channelRef.current?.track({
      user_id: user?.id,
      name: profile?.full_name || 'Anonymous',
      email: user?.email || '',
      isMuted,
      isVideoOff,
      isHandRaised: !isHandRaised,
    });
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        
        const videoTrack = screenStream.getVideoTracks()[0];
        peerConnectionsRef.current.forEach((pc) => {
          const sender = pc.getSenders().find((s) => s.track?.kind === 'video');
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });

        videoTrack.onended = () => {
          setIsScreenSharing(false);
          if (localStreamRef.current) {
            const cameraTrack = localStreamRef.current.getVideoTracks()[0];
            peerConnectionsRef.current.forEach((pc) => {
              const sender = pc.getSenders().find((s) => s.track?.kind === 'video');
              if (sender) {
                sender.replaceTrack(cameraTrack);
              }
            });
          }
        };

        setIsScreenSharing(true);
      } catch (error) {
        console.error('Screen share error:', error);
      }
    } else {
      if (localStreamRef.current) {
        const cameraTrack = localStreamRef.current.getVideoTracks()[0];
        peerConnectionsRef.current.forEach((pc) => {
          const sender = pc.getSenders().find((s) => s.track?.kind === 'video');
          if (sender) {
            sender.replaceTrack(cameraTrack);
          }
        });
      }
      setIsScreenSharing(false);
    }
  };

  // Recording functions
  const startRecording = async () => {
    if (!localStreamRef.current) return;

    try {
      // Get screen + audio for recording
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      // Combine with microphone audio
      const audioContext = new AudioContext();
      const dest = audioContext.createMediaStreamDestination();
      
      if (localStreamRef.current.getAudioTracks().length > 0) {
        const micSource = audioContext.createMediaStreamSource(localStreamRef.current);
        micSource.connect(dest);
      }
      
      if (screenStream.getAudioTracks().length > 0) {
        const screenAudioSource = audioContext.createMediaStreamSource(screenStream);
        screenAudioSource.connect(dest);
      }

      const combinedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...dest.stream.getAudioTracks(),
      ]);

      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: 'video/webm;codecs=vp9',
      });

      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        await saveRecording(blob);
        
        screenStream.getTracks().forEach(track => track.stop());
        clearInterval(recordingIntervalRef.current!);
        setRecordingDuration(0);
      };

      mediaRecorder.start(1000);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

      // Update recording duration
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      // Update meeting status
      await supabase
        .from('meetings')
        .update({ is_recording: true })
        .eq('id', meetingInfo?.id);

      toast({
        title: 'Recording Started',
        description: 'The meeting is now being recorded.',
      });
    } catch (error) {
      console.error('Recording error:', error);
      toast({
        title: 'Recording Error',
        description: 'Could not start recording.',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const saveRecording = async (blob: Blob) => {
    try {
      const fileName = `${user?.id}/${meetingId}/${Date.now()}.webm`;
      
      const { data, error } = await supabase.storage
        .from('meeting-recordings')
        .upload(fileName, blob, {
          contentType: 'video/webm',
        });

      if (error) throw error;

      // Update meeting with recording URL
      const { data: publicUrl } = supabase.storage
        .from('meeting-recordings')
        .getPublicUrl(fileName);

      await supabase
        .from('meetings')
        .update({ 
          recording_url: publicUrl.publicUrl,
          is_recording: false 
        })
        .eq('id', meetingInfo?.id);

      toast({
        title: 'Recording Saved',
        description: 'The meeting recording has been saved to cloud storage.',
      });
    } catch (error) {
      console.error('Save recording error:', error);
      toast({
        title: 'Save Error',
        description: 'Could not save the recording.',
        variant: 'destructive',
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sendChatMessage = () => {
    if (!newMessage.trim()) return;

    channelRef.current?.send({
      type: 'broadcast',
      event: 'chat',
      payload: {
        sender: profile?.full_name || 'Anonymous',
        message: newMessage,
        timestamp: new Date().toISOString(),
      },
    });

    setChatMessages((prev) => [...prev, {
      id: crypto.randomUUID(),
      sender: 'You',
      message: newMessage,
      timestamp: new Date(),
    }]);

    setNewMessage('');
  };

  const leaveMeeting = () => {
    if (isRecording) {
      stopRecording();
    }
    
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    peerConnectionsRef.current.forEach((pc) => pc.close());
    peerConnectionsRef.current.clear();
    channelRef.current?.unsubscribe();
    
    navigate('/admin/meetings');
  };

  const copyMeetingLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
    toast({
      title: 'Link Copied',
      description: 'Meeting link copied to clipboard',
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isRecording) {
        stopRecording();
      }
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      peerConnectionsRef.current.forEach((pc) => pc.close());
      channelRef.current?.unsubscribe();
    };
  }, [isRecording]);

  // Waiting room screen
  if (isInWaitingRoom) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <DoorOpen size={32} className="text-primary" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Waiting Room</h1>
                <p className="text-muted-foreground">
                  Please wait for the host to admit you to the meeting.
                </p>
              </div>

              <div className="aspect-video bg-muted rounded-lg mb-6 relative overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Clock size={16} className="animate-pulse" />
                <span>Waiting for host approval...</span>
              </div>

              <div className="mt-6">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setIsInWaitingRoom(false);
                    navigate('/admin/meetings');
                  }}
                >
                  Leave Waiting Room
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Pre-join screen
  if (!isJoined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold mb-2">Join Meeting</h1>
                <p className="text-muted-foreground">
                  {meetingInfo?.title || 'Loading...'}
                </p>
                {meetingInfo?.waiting_room_enabled && !isHost && (
                  <Badge variant="secondary" className="mt-2">
                    <DoorOpen size={12} className="mr-1" />
                    Waiting room enabled
                  </Badge>
                )}
              </div>

              <div className="aspect-video bg-muted rounded-lg mb-6 relative overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  <Button
                    variant={isMuted ? 'destructive' : 'secondary'}
                    size="icon"
                    onClick={toggleMute}
                  >
                    {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                  </Button>
                  <Button
                    variant={isVideoOff ? 'destructive' : 'secondary'}
                    size="icon"
                    onClick={toggleVideo}
                  >
                    {isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  placeholder="Enter your name"
                  value={profile?.full_name || ''}
                  disabled
                />
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate('/admin/meetings')}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={isHost ? joinMeeting : requestToJoin}
                  >
                    {isHost ? 'Start Meeting' : 'Join Now'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="h-14 border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <h1 className="font-semibold">{meetingInfo?.title || 'Meeting'}</h1>
          <Badge variant="secondary" className="gap-1">
            <Users size={12} />
            {participants.length}
          </Badge>
          {isRecording && (
            <Badge variant="destructive" className="gap-1 animate-pulse">
              <Circle size={8} className="fill-current" />
              REC {formatDuration(recordingDuration)}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={copyMeetingLink}>
            {linkCopied ? <Check size={16} /> : <Copy size={16} />}
            <span className="ml-1">Copy Link</span>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video grid */}
        <div className="flex-1 p-4">
          <div className={`grid gap-4 h-full ${
            participants.length <= 1 ? 'grid-cols-1' :
            participants.length <= 4 ? 'grid-cols-2' :
            participants.length <= 9 ? 'grid-cols-3' :
            'grid-cols-4'
          }`}>
            {/* Local video */}
            <div className="relative bg-muted rounded-lg overflow-hidden">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 flex items-center gap-2">
                <span className="text-xs bg-black/50 text-white px-2 py-1 rounded">
                  You {isHandRaised && '✋'}
                </span>
                {isMuted && (
                  <span className="bg-destructive text-white p-1 rounded">
                    <MicOff size={12} />
                  </span>
                )}
              </div>
            </div>

            {/* Remote participants */}
            {participants
              .filter((p) => p.id !== user?.id)
              .map((participant) => (
                <div
                  key={participant.id}
                  className="relative bg-muted rounded-lg overflow-hidden flex items-center justify-center"
                >
                  {participant.isVideoOff ? (
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={participant.avatar_url} />
                      <AvatarFallback className="text-2xl">
                        {participant.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-full h-full bg-muted" />
                  )}
                  <div className="absolute bottom-2 left-2 flex items-center gap-2">
                    <span className="text-xs bg-black/50 text-white px-2 py-1 rounded">
                      {participant.name} {participant.isHost && '👑'} {participant.isHandRaised && '✋'}
                    </span>
                    {participant.isMuted && (
                      <span className="bg-destructive text-white p-1 rounded">
                        <MicOff size={12} />
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Waiting room sidebar (for host) */}
        {isHost && waitingParticipants.length > 0 && (
          <div className="w-72 border-l p-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <DoorOpen size={16} />
                  Waiting Room ({waitingParticipants.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <AnimatePresence>
                  {waitingParticipants.map((participant) => (
                    <motion.div
                      key={participant.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center gap-3 p-2 rounded-lg bg-muted"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={participant.avatar_url} />
                        <AvatarFallback className="text-xs">
                          {participant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{participant.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{participant.email}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-green-500 hover:text-green-600 hover:bg-green-500/10"
                          onClick={() => admitParticipant(participant)}
                        >
                          <UserPlus size={14} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => denyParticipant(participant)}
                        >
                          <UserMinus size={14} />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Chat sidebar */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed right-4 top-1/2 -translate-y-1/2"
            >
              <MessageSquare size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Chat</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col h-[calc(100vh-8rem)]">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4 py-4">
                  {chatMessages.map((msg) => (
                    <div key={msg.id}>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{msg.sender}</span>
                        <span className="text-muted-foreground text-xs">
                          {msg.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{msg.message}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="flex gap-2 pt-4">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') sendChatMessage();
                  }}
                />
                <Button size="icon" onClick={sendChatMessage}>
                  <MessageSquare size={16} />
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Controls bar */}
      <div className="h-20 border-t flex items-center justify-center gap-2 px-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isMuted ? 'destructive' : 'secondary'}
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={toggleMute}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isMuted ? 'Unmute' : 'Mute'}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isVideoOff ? 'destructive' : 'secondary'}
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={toggleVideo}
            >
              {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isVideoOff ? 'Turn on camera' : 'Turn off camera'}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isScreenSharing ? 'default' : 'secondary'}
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={toggleScreenShare}
            >
              <Monitor size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isScreenSharing ? 'Stop sharing' : 'Share screen'}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isHandRaised ? 'default' : 'secondary'}
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={toggleHandRaise}
            >
              <Hand size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isHandRaised ? 'Lower hand' : 'Raise hand'}</TooltipContent>
        </Tooltip>

        {/* Recording control (host only) */}
        {isHost && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isRecording ? 'destructive' : 'secondary'}
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? <StopCircle size={20} /> : <Circle size={20} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isRecording ? 'Stop recording' : 'Start recording'}</TooltipContent>
          </Tooltip>
        )}

        <div className="w-px h-8 bg-border mx-2" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={leaveMeeting}
            >
              <Phone size={20} className="rotate-[135deg]" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Leave meeting</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}