import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  Users,
  MessageSquare,
  Share2,
  Settings,
  Monitor,
  Hand,
  MoreVertical,
  Copy,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [meetingInfo, setMeetingInfo] = useState<any>(null);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const channelRef = useRef<any>(null);

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
    };

    fetchMeeting();
  }, [meetingId, toast]);

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

  // Join meeting via Supabase Realtime
  const joinMeeting = async () => {
    const stream = await initializeMedia();
    if (!stream) return;

    // Setup Supabase Realtime channel for signaling
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
        // Create peer connection for new participant
        newPresences.forEach((presence: any) => {
          if (presence.user_id !== user?.id) {
            createPeerConnection(presence.user_id, stream);
          }
        });
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
        // Clean up peer connection
        leftPresences.forEach((presence: any) => {
          const pc = peerConnectionsRef.current.get(presence.user_id);
          if (pc) {
            pc.close();
            peerConnectionsRef.current.delete(presence.user_id);
          }
        });
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
    setIsJoined(true);
  };

  // Create peer connection
  const createPeerConnection = async (peerId: string, stream: MediaStream) => {
    const pc = new RTCPeerConnection(iceServers);
    
    // Add local tracks
    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });

    // Handle ICE candidates
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

    // Handle remote stream
    pc.ontrack = (event) => {
      console.log('Remote track received:', event.streams[0]);
      // Add remote video element dynamically
    };

    peerConnectionsRef.current.set(peerId, pc);

    // Create and send offer
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
      
      // Update presence
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
        
        // Replace video track in peer connections
        const videoTrack = screenStream.getVideoTracks()[0];
        peerConnectionsRef.current.forEach((pc) => {
          const sender = pc.getSenders().find((s) => s.track?.kind === 'video');
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });

        videoTrack.onended = () => {
          setIsScreenSharing(false);
          // Restore camera
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
      // Stop screen sharing
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
    // Stop all tracks
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    
    // Close all peer connections
    peerConnectionsRef.current.forEach((pc) => pc.close());
    peerConnectionsRef.current.clear();
    
    // Unsubscribe from channel
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
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      peerConnectionsRef.current.forEach((pc) => pc.close());
      channelRef.current?.unsubscribe();
    };
  }, []);

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
                    onClick={joinMeeting}
                  >
                    Join Now
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