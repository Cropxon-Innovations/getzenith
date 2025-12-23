-- Create notifications table for real-time notifications
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  message TEXT,
  data JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create team invitations table
CREATE TABLE public.team_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  phone TEXT,
  role app_role NOT NULL DEFAULT 'viewer',
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  status TEXT NOT NULL DEFAULT 'pending',
  notification_method TEXT DEFAULT 'email',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table for internal messaging (Enterprise)
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  channel_id UUID,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  attachments JSONB DEFAULT '[]',
  read_by JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create channels table for group messaging
CREATE TABLE public.channels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'public',
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  members UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meetings table for video calls
CREATE TABLE public.meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participants UUID[] DEFAULT '{}',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER DEFAULT 60,
  meeting_link TEXT,
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subscriptions table for billing
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE UNIQUE,
  plan TEXT NOT NULL DEFAULT 'trial',
  status TEXT NOT NULL DEFAULT 'active',
  payment_provider TEXT,
  payment_id TEXT,
  amount INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  billing_cycle TEXT DEFAULT 'monthly',
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment_history table
CREATE TABLE public.payment_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT NOT NULL,
  payment_provider TEXT,
  payment_id TEXT,
  invoice_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

-- Notifications RLS Policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL AND user_in_tenant(auth.uid(), tenant_id));

CREATE POLICY "System can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (user_in_tenant(auth.uid(), tenant_id));

CREATE POLICY "Users can update their notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their notifications" ON public.notifications
  FOR DELETE USING (user_id = auth.uid());

-- Team Invitations RLS Policies
CREATE POLICY "Tenant admins can view invitations" ON public.team_invitations
  FOR SELECT USING (user_in_tenant(auth.uid(), tenant_id));

CREATE POLICY "Tenant admins can create invitations" ON public.team_invitations
  FOR INSERT WITH CHECK (user_in_tenant(auth.uid(), tenant_id) AND has_role(auth.uid(), 'tenant_admin'));

CREATE POLICY "Tenant admins can update invitations" ON public.team_invitations
  FOR UPDATE USING (user_in_tenant(auth.uid(), tenant_id) AND has_role(auth.uid(), 'tenant_admin'));

CREATE POLICY "Tenant admins can delete invitations" ON public.team_invitations
  FOR DELETE USING (user_in_tenant(auth.uid(), tenant_id) AND has_role(auth.uid(), 'tenant_admin'));

-- Messages RLS Policies
CREATE POLICY "Users can view messages in their tenant" ON public.messages
  FOR SELECT USING (user_in_tenant(auth.uid(), tenant_id));

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (user_in_tenant(auth.uid(), tenant_id) AND sender_id = auth.uid());

CREATE POLICY "Users can update their messages" ON public.messages
  FOR UPDATE USING (sender_id = auth.uid());

CREATE POLICY "Users can delete their messages" ON public.messages
  FOR DELETE USING (sender_id = auth.uid());

-- Channels RLS Policies
CREATE POLICY "Users can view channels in their tenant" ON public.channels
  FOR SELECT USING (user_in_tenant(auth.uid(), tenant_id));

CREATE POLICY "Admins can create channels" ON public.channels
  FOR INSERT WITH CHECK (user_in_tenant(auth.uid(), tenant_id));

CREATE POLICY "Channel creators can update" ON public.channels
  FOR UPDATE USING (created_by = auth.uid() OR has_role(auth.uid(), 'tenant_admin'));

CREATE POLICY "Channel creators can delete" ON public.channels
  FOR DELETE USING (created_by = auth.uid() OR has_role(auth.uid(), 'tenant_admin'));

-- Meetings RLS Policies
CREATE POLICY "Users can view meetings in their tenant" ON public.meetings
  FOR SELECT USING (user_in_tenant(auth.uid(), tenant_id));

CREATE POLICY "Users can create meetings" ON public.meetings
  FOR INSERT WITH CHECK (user_in_tenant(auth.uid(), tenant_id) AND host_id = auth.uid());

CREATE POLICY "Hosts can update meetings" ON public.meetings
  FOR UPDATE USING (host_id = auth.uid());

CREATE POLICY "Hosts can delete meetings" ON public.meetings
  FOR DELETE USING (host_id = auth.uid());

-- Subscriptions RLS Policies
CREATE POLICY "Tenant admins can view subscriptions" ON public.subscriptions
  FOR SELECT USING (user_in_tenant(auth.uid(), tenant_id));

CREATE POLICY "System can manage subscriptions" ON public.subscriptions
  FOR ALL USING (user_in_tenant(auth.uid(), tenant_id) AND has_role(auth.uid(), 'tenant_admin'));

-- Payment History RLS Policies
CREATE POLICY "Tenant admins can view payment history" ON public.payment_history
  FOR SELECT USING (user_in_tenant(auth.uid(), tenant_id) AND has_role(auth.uid(), 'tenant_admin'));

-- Enable realtime for notifications and messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Create indexes for performance
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_tenant_id ON public.notifications(tenant_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_messages_tenant_id ON public.messages(tenant_id);
CREATE INDEX idx_messages_channel_id ON public.messages(channel_id);
CREATE INDEX idx_team_invitations_email ON public.team_invitations(email);
CREATE INDEX idx_team_invitations_token ON public.team_invitations(token);