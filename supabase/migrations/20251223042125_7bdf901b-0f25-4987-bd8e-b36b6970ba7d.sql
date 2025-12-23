-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('tenant_admin', 'editor', 'mentor', 'viewer');

-- Create content status enum
CREATE TYPE public.content_status AS ENUM ('draft', 'published', 'scheduled', 'archived');

-- Create tenants table
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  subdomain TEXT UNIQUE,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#3B82F6',
  font_family TEXT DEFAULT 'Inter',
  plan TEXT DEFAULT 'trial',
  trial_ends_at TIMESTAMPTZ DEFAULT (now() + interval '30 days'),
  business_type TEXT,
  business_goals TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  current_tenant_id UUID REFERENCES public.tenants(id),
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user_roles table (CRITICAL: separate table for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, tenant_id, role)
);

-- Create CMS content table
CREATE TABLE public.cms_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  type TEXT DEFAULT 'article',
  status content_status DEFAULT 'draft',
  data JSONB DEFAULT '{}',
  author_id UUID REFERENCES auth.users(id),
  tags TEXT[] DEFAULT '{}',
  access_level TEXT DEFAULT 'public',
  published_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (tenant_id, slug)
);

-- Create CMS versions table
CREATE TABLE public.cms_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES public.cms_content(id) ON DELETE CASCADE NOT NULL,
  data JSONB NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  changes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create CMS media table
CREATE TABLE public.cms_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  folder TEXT DEFAULT 'Uploads',
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create content locks table for collaboration
CREATE TABLE public.content_locks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES public.cms_content(id) ON DELETE CASCADE NOT NULL,
  section_id TEXT,
  locked_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  locked_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '5 minutes'),
  UNIQUE (content_id, section_id)
);

-- Enable Row Level Security
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_locks ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get user's tenant id
CREATE OR REPLACE FUNCTION public.get_user_tenant_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT current_tenant_id FROM public.profiles WHERE id = _user_id
$$;

-- Function to check if user belongs to tenant
CREATE OR REPLACE FUNCTION public.user_in_tenant(_user_id UUID, _tenant_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND tenant_id = _tenant_id
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for tenants
CREATE POLICY "Users can view their tenant"
  ON public.tenants FOR SELECT
  USING (public.user_in_tenant(auth.uid(), id));

CREATE POLICY "Tenant admins can update tenant"
  ON public.tenants FOR UPDATE
  USING (public.user_in_tenant(auth.uid(), id) AND public.has_role(auth.uid(), 'tenant_admin'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view roles in their tenant"
  ON public.user_roles FOR SELECT
  USING (user_id = auth.uid() OR public.user_in_tenant(auth.uid(), tenant_id));

CREATE POLICY "Tenant admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'tenant_admin') AND public.user_in_tenant(auth.uid(), tenant_id));

-- RLS Policies for cms_content
CREATE POLICY "Users can view content in their tenant"
  ON public.cms_content FOR SELECT
  USING (public.user_in_tenant(auth.uid(), tenant_id));

CREATE POLICY "Editors can create content"
  ON public.cms_content FOR INSERT
  WITH CHECK (public.user_in_tenant(auth.uid(), tenant_id));

CREATE POLICY "Editors can update content"
  ON public.cms_content FOR UPDATE
  USING (public.user_in_tenant(auth.uid(), tenant_id));

CREATE POLICY "Editors can delete content"
  ON public.cms_content FOR DELETE
  USING (public.user_in_tenant(auth.uid(), tenant_id) AND public.has_role(auth.uid(), 'tenant_admin'));

-- RLS Policies for cms_versions
CREATE POLICY "Users can view versions"
  ON public.cms_versions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.cms_content 
    WHERE id = content_id AND public.user_in_tenant(auth.uid(), tenant_id)
  ));

CREATE POLICY "Users can create versions"
  ON public.cms_versions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.cms_content 
    WHERE id = content_id AND public.user_in_tenant(auth.uid(), tenant_id)
  ));

-- RLS Policies for cms_media
CREATE POLICY "Users can view media in tenant"
  ON public.cms_media FOR SELECT
  USING (public.user_in_tenant(auth.uid(), tenant_id));

CREATE POLICY "Users can upload media"
  ON public.cms_media FOR INSERT
  WITH CHECK (public.user_in_tenant(auth.uid(), tenant_id));

CREATE POLICY "Users can delete own media"
  ON public.cms_media FOR DELETE
  USING (uploaded_by = auth.uid());

-- RLS Policies for content_locks
CREATE POLICY "Users can view locks"
  ON public.content_locks FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.cms_content 
    WHERE id = content_id AND public.user_in_tenant(auth.uid(), tenant_id)
  ));

CREATE POLICY "Users can create locks"
  ON public.content_locks FOR INSERT
  WITH CHECK (locked_by = auth.uid());

CREATE POLICY "Users can release own locks"
  ON public.content_locks FOR DELETE
  USING (locked_by = auth.uid());

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON public.tenants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cms_content_updated_at
  BEFORE UPDATE ON public.cms_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for collaboration
ALTER PUBLICATION supabase_realtime ADD TABLE public.content_locks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cms_content;