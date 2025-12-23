import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Building2,
  Globe,
  Palette,
  Users,
  Shield,
  Bell,
  CreditCard,
  Settings,
  Mail,
  Phone,
  Crown,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ZenithLogo } from '@/components/ZenithLogo';
import { VerificationStatusCard, VerificationStatus } from '@/components/admin/VerificationBadge';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettings() {
  const { user, profile, tenant, signOut, isLoading, updateTenant } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form states
  const [brandName, setBrandName] = useState(tenant?.name || '');
  const [primaryColor, setPrimaryColor] = useState(tenant?.primary_color || '#3B82F6');
  const [subdomain, setSubdomain] = useState(tenant?.subdomain || '');

  const emailStatus: VerificationStatus = user?.email_confirmed_at ? 'verified' : 'pending';
  const phoneStatus: VerificationStatus = user?.phone_confirmed_at ? 'verified' : 'unverified';

  const trialDaysLeft = tenant?.trial_ends_at 
    ? Math.max(0, Math.ceil((new Date(tenant.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 30;
  
  const isTrialExpired = trialDaysLeft <= 0;

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (tenant) {
      setBrandName(tenant.name);
      setPrimaryColor(tenant.primary_color || '#3B82F6');
      setSubdomain(tenant.subdomain || '');
    }
  }, [tenant]);

  const handleCopyDomain = () => {
    const domain = `${tenant?.slug || 'your-tenant'}.getzenith.io`;
    navigator.clipboard.writeText(domain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: 'Copied!', description: 'Domain copied to clipboard' });
  };

  const handleSaveBranding = async () => {
    if (!updateTenant) return;
    setSaving(true);
    try {
      await updateTenant({ name: brandName, primary_color: primaryColor });
      toast({ title: 'Saved!', description: 'Branding settings updated successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save settings', variant: 'destructive' });
    }
    setSaving(false);
  };

  const handleVerifyEmail = () => {
    toast({
      title: 'Verification email sent',
      description: 'Check your inbox for the verification link.',
    });
  };

  const handleVerifyPhone = () => {
    toast({
      title: 'Coming Soon',
      description: 'Phone verification will be available soon.',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
          <ZenithLogo size={48} />
        </motion.div>
      </div>
    );
  }

  const previewDomain = `${tenant?.slug || 'your-tenant'}.getzenith.io`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="h-full max-w-5xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin">
                <ArrowLeft size={20} />
              </Link>
            </Button>
            <div>
              <h1 className="font-semibold text-foreground">Settings</h1>
              <p className="text-xs text-muted-foreground">{tenant?.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto gap-2 bg-transparent p-0">
            <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Building2 size={16} className="mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="branding" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Palette size={16} className="mr-2" />
              Branding
            </TabsTrigger>
            <TabsTrigger value="domain" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Globe size={16} className="mr-2" />
              Domain
            </TabsTrigger>
            <TabsTrigger value="team" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users size={16} className="mr-2" />
              Team
            </TabsTrigger>
            <TabsTrigger value="billing" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <CreditCard size={16} className="mr-2" />
              Billing
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* Account Info */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield size={20} className="text-primary" />
                    Account Information
                  </CardTitle>
                  <CardDescription>Your account details and verification status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Full Name</Label>
                      <p className="font-medium">{profile?.full_name || 'Not set'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Email</Label>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Role</Label>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          <Crown size={12} className="mr-1" />
                          Tenant Admin
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Member Since</Label>
                      <p className="font-medium">
                        {user?.created_at 
                          ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                          : 'Recently'
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Verification Status */}
              <VerificationStatusCard
                emailStatus={emailStatus}
                phoneStatus={phoneStatus}
                email={user?.email}
                phone={user?.phone}
                onVerifyEmail={handleVerifyEmail}
                onVerifyPhone={handleVerifyPhone}
              />
            </motion.div>
          </TabsContent>

          {/* Branding Settings */}
          <TabsContent value="branding" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette size={20} className="text-primary" />
                    Brand Identity
                  </CardTitle>
                  <CardDescription>Customize your platform's appearance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="brandName">Brand Name</Label>
                    <Input 
                      id="brandName" 
                      value={brandName} 
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="Your Business Name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="color" 
                        id="primaryColor"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-12 h-12 rounded-lg border border-border cursor-pointer"
                      />
                      <Input 
                        value={primaryColor} 
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Logo</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <p className="text-muted-foreground">Drag & drop your logo here or click to upload</p>
                      <Button variant="outline" size="sm" className="mt-3">
                        Upload Logo
                      </Button>
                    </div>
                  </div>

                  <Button onClick={handleSaveBranding} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Domain Settings */}
          <TabsContent value="domain" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe size={20} className="text-primary" />
                    Domain Settings
                  </CardTitle>
                  <CardDescription>Manage your platform's domain configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Trial Domain */}
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="font-medium">Preview Domain</Label>
                      <Badge variant={isTrialExpired ? 'destructive' : 'secondary'}>
                        {isTrialExpired ? 'Trial Expired' : `${trialDaysLeft} days left`}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 p-3 bg-background rounded-md border border-border font-mono text-sm">
                        {previewDomain}
                      </div>
                      <Button variant="outline" size="icon" onClick={handleCopyDomain}>
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <a href={`https://${previewDomain}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink size={16} />
                        </a>
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      This is your free preview domain during the trial period.
                    </p>
                  </div>

                  {/* Custom Domain */}
                  <div className="p-4 rounded-lg border border-dashed border-border">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="font-medium">Custom Domain</Label>
                      <Badge variant="outline">Pro Feature</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect your own domain (e.g., app.yourbusiness.com) after subscribing.
                    </p>
                    <Button variant="outline" disabled={!isTrialExpired}>
                      {isTrialExpired ? 'Subscribe to Add Custom Domain' : 'Available After Trial'}
                    </Button>
                  </div>

                  {/* Data Safety Notice */}
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield size={16} className="text-green-500" />
                      <span className="font-medium text-green-500">Your Data is Safe</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      No lock-in. Export your data anytime. Your content and settings are always yours.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Team Settings */}
          <TabsContent value="team" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users size={20} className="text-primary" />
                    Team Management
                  </CardTitle>
                  <CardDescription>Invite team members and manage roles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current User */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-medium">
                          {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{profile?.full_name || 'You'}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      <Crown size={12} className="mr-1" />
                      Admin
                    </Badge>
                  </div>

                  {/* Invite Member */}
                  <div className="space-y-3">
                    <Label>Invite Team Member</Label>
                    <div className="flex gap-2">
                      <Input placeholder="Enter email address" className="flex-1" />
                      <Button>Send Invite</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Team members will receive an email with login credentials.
                    </p>
                  </div>

                  {/* Role Types */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { role: 'Editor', desc: 'Create and edit content' },
                      { role: 'Mentor', desc: 'Manage courses and students' },
                      { role: 'Viewer', desc: 'View-only access' },
                    ].map((item) => (
                      <div key={item.role} className="p-3 rounded-lg border border-border">
                        <p className="font-medium text-sm">{item.role}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Billing Settings */}
          <TabsContent value="billing" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard size={20} className="text-primary" />
                    Subscription & Billing
                  </CardTitle>
                  <CardDescription>Manage your subscription and payment details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current Plan */}
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Current Plan</span>
                      <Badge className="bg-primary text-primary-foreground">
                        {tenant?.plan === 'trial' ? '30-Day Trial' : tenant?.plan || 'Trial'}
                      </Badge>
                    </div>
                    {tenant?.plan === 'trial' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Trial ends</span>
                          <span className={isTrialExpired ? 'text-destructive' : 'text-foreground'}>
                            {tenant?.trial_ends_at 
                              ? new Date(tenant.trial_ends_at).toLocaleDateString()
                              : 'In 30 days'
                            }
                          </span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all"
                            style={{ width: `${Math.max(0, (trialDaysLeft / 30) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Upgrade CTA */}
                  {(tenant?.plan === 'trial' || isTrialExpired) && (
                    <div className="p-4 rounded-lg border border-border">
                      <h4 className="font-medium mb-2">
                        {isTrialExpired ? 'Your trial has expired' : 'Ready to upgrade?'}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        {isTrialExpired 
                          ? 'Subscribe now to continue using Zenith and keep your custom domain.'
                          : 'Unlock all features including custom domains, automation, and priority support.'
                        }
                      </p>
                      <Button>
                        {isTrialExpired ? 'Subscribe Now' : 'View Plans'}
                      </Button>
                    </div>
                  )}

                  {/* Features Included */}
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Included in Trial</Label>
                    <ul className="space-y-2 text-sm">
                      {[
                        'All Studios (CMS, Canvas, Website, LMS)',
                        'Preview domain (your-name.getzenith.io)',
                        '1 Team member',
                        'Basic analytics',
                      ].map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check size={14} className="text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
