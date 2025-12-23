-- Create storage bucket for meeting recordings
INSERT INTO storage.buckets (id, name, public)
VALUES ('meeting-recordings', 'meeting-recordings', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for meeting recordings bucket
CREATE POLICY "Users can upload their meeting recordings"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'meeting-recordings' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their meeting recordings"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'meeting-recordings' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their meeting recordings"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'meeting-recordings' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add waiting room columns to meetings table
ALTER TABLE public.meetings 
ADD COLUMN IF NOT EXISTS waiting_room_enabled boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS waiting_room_participants jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS recording_url text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS is_recording boolean DEFAULT false;

-- Update trial_ends_at for tenants to be 30 days from now for testing
UPDATE public.tenants 
SET trial_ends_at = now() + interval '30 days'
WHERE trial_ends_at IS NULL OR trial_ends_at < now();