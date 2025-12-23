import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  current_tenant_id: string | null;
  onboarding_completed: boolean;
}

interface Tenant {
  id: string;
  name: string;
  slug: string;
  subdomain: string | null;
  logo_url: string | null;
  primary_color: string;
  font_family: string;
  plan: string;
  business_type: string | null;
  business_goals: string[];
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  tenant: Tenant | null;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateTenant: (updates: Partial<Tenant>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (!error && data) {
      setProfile(data);
      
      if (data.current_tenant_id) {
        const { data: tenantData } = await supabase
          .from('tenants')
          .select('*')
          .eq('id', data.current_tenant_id)
          .maybeSingle();
        
        if (tenantData) {
          setTenant(tenantData);
        }
      }
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setTenant(null);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/admin/onboarding`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { full_name: fullName }
      }
    });

    if (error) return { error };

    if (data.user) {
      // Create tenant with slug from email
      const slug = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-');
      const uniqueSlug = `${slug}-${Date.now().toString(36)}`;
      
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .insert({
          name: fullName || email.split('@')[0],
          slug: uniqueSlug,
          subdomain: `${uniqueSlug}.getzenith.io`
        })
        .select()
        .single();

      if (tenantError) return { error: tenantError };

      // Assign tenant_admin role
      await supabase.from('user_roles').insert({
        user_id: data.user.id,
        tenant_id: tenantData.id,
        role: 'tenant_admin'
      });

      // Update profile with tenant
      await supabase.from('profiles').update({
        current_tenant_id: tenantData.id,
        full_name: fullName
      }).eq('id', data.user.id);
    }

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setTenant(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const updateTenant = async (updates: Partial<Tenant>) => {
    if (!tenant) return { error: new Error('No tenant') };
    
    const { error } = await supabase
      .from('tenants')
      .update(updates)
      .eq('id', tenant.id);
    
    if (!error) {
      setTenant(prev => prev ? { ...prev, ...updates } : null);
    }
    
    return { error };
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      tenant,
      isLoading,
      signUp,
      signIn,
      signOut,
      refreshProfile,
      updateTenant
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
