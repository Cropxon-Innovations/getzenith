import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Globe,
  Paintbrush,
  Copy,
  Check,
  ExternalLink,
  Upload,
  Shield,
  Clock,
  Sparkles,
  Crown,
  AlertTriangle,
  RefreshCw,
  Palette,
  Type,
  Image,
  Link2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const fontOptions = [
  { value: 'inter', label: 'Inter', sample: 'Modern & Clean' },
  { value: 'poppins', label: 'Poppins', sample: 'Friendly & Round' },
  { value: 'roboto', label: 'Roboto', sample: 'Professional' },
  { value: 'open-sans', label: 'Open Sans', sample: 'Readable & Neutral' },
  { value: 'playfair', label: 'Playfair Display', sample: 'Elegant & Serif' },
];

const colorPresets = [
  { name: 'Ocean Blue', primary: '#3B82F6', accent: '#0EA5E9' },
  { name: 'Forest Green', primary: '#22C55E', accent: '#10B981' },
  { name: 'Royal Purple', primary: '#8B5CF6', accent: '#A855F7' },
  { name: 'Sunset Orange', primary: '#F97316', accent: '#FB923C' },
  { name: 'Rose Pink', primary: '#EC4899', accent: '#F472B6' },
  { name: 'Slate Gray', primary: '#64748B', accent: '#94A3B8' },
];

export default function BusinessManagement() {
  const { tenant, updateTenant } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form states
  const [businessName, setBusinessName] = useState(tenant?.name || '');
  const [primaryColor, setPrimaryColor] = useState(tenant?.primary_color || '#3B82F6');
  const [accentColor, setAccentColor] = useState('#0EA5E9');
  const [fontFamily, setFontFamily] = useState(tenant?.font_family || 'inter');
  const [customDomain, setCustomDomain] = useState('');
  const [enableDarkMode, setEnableDarkMode] = useState(true);
  const [enableRTL, setEnableRTL] = useState(false);

  const trialDaysLeft = tenant?.trial_ends_at 
    ? Math.max(0, Math.ceil((new Date(tenant.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 30;
  
  const isTrialExpired = trialDaysLeft <= 0;
  const previewDomain = `${tenant?.slug || 'your-tenant'}.getzenith.io`;

  const handleCopyDomain = () => {
    navigator.clipboard.writeText(previewDomain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: 'Copied!', description: 'Domain copied to clipboard' });
  };

  const handleSaveSettings = async () => {
    if (!updateTenant) return;
    setSaving(true);
    try {
      await updateTenant({ 
        name: businessName, 
        primary_color: primaryColor,
        font_family: fontFamily 
      });
      toast({ title: 'Saved!', description: 'Business settings updated successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save settings', variant: 'destructive' });
    }
    setSaving(false);
  };

  const handleApplyPreset = (preset: typeof colorPresets[0]) => {
    setPrimaryColor(preset.primary);
    setAccentColor(preset.accent);
    toast({ title: 'Theme Applied', description: `${preset.name} theme colors applied` });
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Business Management</h1>
            <p className="text-muted-foreground">Configure your business identity and platform settings</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className={isTrialExpired ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}>
              <Clock size={14} className="mr-1" />
              {isTrialExpired ? 'Trial Expired' : `${trialDaysLeft} days left`}
            </Badge>
            <Button onClick={handleSaveSettings} disabled={saving}>
              {saving ? (
                <>
                  <RefreshCw size={14} className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="company" className="space-y-6">
          <TabsList className="grid w-full sm:w-auto sm:inline-grid grid-cols-3 gap-2">
            <TabsTrigger value="company" className="gap-2">
              <Building2 size={16} />
              <span className="hidden sm:inline">Company</span>
            </TabsTrigger>
            <TabsTrigger value="branding" className="gap-2">
              <Paintbrush size={16} />
              <span className="hidden sm:inline">Branding</span>
            </TabsTrigger>
            <TabsTrigger value="domains" className="gap-2">
              <Globe size={16} />
              <span className="hidden sm:inline">Domains</span>
            </TabsTrigger>
          </TabsList>

          {/* Company Settings Tab */}
          <TabsContent value="company" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Company Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 size={20} className="text-primary" />
                      Company Information
                    </CardTitle>
                    <CardDescription>Basic information about your business</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input 
                        id="businessName" 
                        value={businessName} 
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Your Company Name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="businessType">Business Type</Label>
                      <Select defaultValue={tenant?.business_type || 'saas'}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="saas">SaaS / Software</SelectItem>
                          <SelectItem value="agency">Agency</SelectItem>
                          <SelectItem value="ecommerce">E-commerce</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="consulting">Consulting</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Select defaultValue="technology">
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="media">Media & Entertainment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="utc">
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                          <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                          <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                          <SelectItem value="gmt">GMT (Greenwich Mean Time)</SelectItem>
                          <SelectItem value="ist">IST (India Standard Time)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Platform Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles size={20} className="text-primary" />
                      Platform Settings
                    </CardTitle>
                    <CardDescription>Configure platform behavior</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Dark Mode Support</Label>
                        <p className="text-sm text-muted-foreground">Allow users to switch to dark theme</p>
                      </div>
                      <Switch 
                        checked={enableDarkMode} 
                        onCheckedChange={setEnableDarkMode} 
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>RTL Support</Label>
                        <p className="text-sm text-muted-foreground">Enable right-to-left text direction</p>
                      </div>
                      <Switch 
                        checked={enableRTL} 
                        onCheckedChange={setEnableRTL} 
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Maintenance Mode</Label>
                        <p className="text-sm text-muted-foreground">Show maintenance page to visitors</p>
                      </div>
                      <Switch />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Public Registration</Label>
                        <p className="text-sm text-muted-foreground">Allow new users to sign up</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Subscription Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2"
              >
                <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
                  <CardContent className="py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Crown size={32} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">
                          {tenant?.plan === 'trial' ? '30-Day Trial' : tenant?.plan || 'Trial Plan'}
                        </h3>
                        <p className="text-muted-foreground">
                          {isTrialExpired 
                            ? 'Your trial has expired. Subscribe to continue using all features.'
                            : `You have ${trialDaysLeft} days left in your trial. Upgrade anytime to unlock premium features.`
                          }
                        </p>
                      </div>
                      <Button size="lg" className="shrink-0">
                        <Sparkles size={16} className="mr-2" />
                        {isTrialExpired ? 'Subscribe Now' : 'Upgrade to Pro'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Branding Tab */}
          <TabsContent value="branding" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Colors */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette size={20} className="text-primary" />
                      Brand Colors
                    </CardTitle>
                    <CardDescription>Define your brand color palette</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Label>Primary Color</Label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="color" 
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-14 h-14 rounded-lg border border-border cursor-pointer"
                        />
                        <Input 
                          value={primaryColor} 
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="flex-1 font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Accent Color</Label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="color" 
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                          className="w-14 h-14 rounded-lg border border-border cursor-pointer"
                        />
                        <Input 
                          value={accentColor} 
                          onChange={(e) => setAccentColor(e.target.value)}
                          className="flex-1 font-mono"
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label>Color Presets</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {colorPresets.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => handleApplyPreset(preset)}
                            className="group p-3 rounded-lg border border-border hover:border-primary transition-colors text-left"
                          >
                            <div className="flex gap-1 mb-2">
                              <div 
                                className="w-6 h-6 rounded-full" 
                                style={{ backgroundColor: preset.primary }} 
                              />
                              <div 
                                className="w-6 h-6 rounded-full" 
                                style={{ backgroundColor: preset.accent }} 
                              />
                            </div>
                            <span className="text-xs text-muted-foreground group-hover:text-foreground">
                              {preset.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Typography & Logo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Type size={20} className="text-primary" />
                      Typography
                    </CardTitle>
                    <CardDescription>Choose your brand fonts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Primary Font</Label>
                      <Select value={fontFamily} onValueChange={setFontFamily}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent>
                          {fontOptions.map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              <div className="flex items-center justify-between w-full">
                                <span>{font.label}</span>
                                <span className="text-xs text-muted-foreground ml-2">{font.sample}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Image size={20} className="text-primary" />
                      Logo & Favicon
                    </CardTitle>
                    <CardDescription>Upload your brand assets</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Logo</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                        <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
                        <p className="text-xs text-muted-foreground mt-1">SVG, PNG or JPG (max 2MB)</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Favicon</Label>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <Image size={20} className="text-muted-foreground" />
                        </div>
                        <Button variant="outline" size="sm">
                          <Upload size={14} className="mr-2" />
                          Upload Favicon
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Live Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Live Preview</CardTitle>
                    <CardDescription>See how your branding looks in action</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="rounded-lg border border-border p-6"
                      style={{ fontFamily: fontFamily }}
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: primaryColor }}
                        >
                          {businessName?.charAt(0) || 'Z'}
                        </div>
                        <div>
                          <h3 className="font-semibold" style={{ color: primaryColor }}>
                            {businessName || 'Your Business'}
                          </h3>
                          <p className="text-sm text-muted-foreground">Welcome to your platform</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button style={{ backgroundColor: primaryColor }}>
                          Primary Action
                        </Button>
                        <Button 
                          variant="outline" 
                          style={{ borderColor: primaryColor, color: primaryColor }}
                        >
                          Secondary Action
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Domains Tab */}
          <TabsContent value="domains" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Preview Domain */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Link2 size={20} className="text-primary" />
                      Preview Domain
                    </CardTitle>
                    <CardDescription>Your free Zenith subdomain</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                          <Check size={12} className="mr-1" />
                          Active
                        </Badge>
                        <Badge variant={isTrialExpired ? 'destructive' : 'secondary'}>
                          {isTrialExpired ? 'Expired' : `${trialDaysLeft} days left`}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex-1 p-3 bg-background rounded-md border border-border font-mono text-sm truncate">
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
                    </div>
                    <p className="text-sm text-muted-foreground">
                      This domain is included free during your trial period.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Custom Domain */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className={isTrialExpired ? '' : 'opacity-75'}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe size={20} className="text-primary" />
                      Custom Domain
                      <Badge variant="outline" className="ml-auto">Pro</Badge>
                    </CardTitle>
                    <CardDescription>Connect your own domain</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="customDomain">Your Domain</Label>
                      <Input 
                        id="customDomain"
                        value={customDomain}
                        onChange={(e) => setCustomDomain(e.target.value)}
                        placeholder="app.yourbusiness.com"
                        disabled={!isTrialExpired}
                      />
                    </div>
                    
                    {!isTrialExpired ? (
                      <div className="p-4 rounded-lg bg-muted/50 border border-dashed border-border">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock size={16} />
                          <span className="text-sm">Available after trial ends or when you upgrade</span>
                        </div>
                      </div>
                    ) : (
                      <Button className="w-full">
                        Connect Domain
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* DNS Instructions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield size={20} className="text-primary" />
                      DNS Configuration
                    </CardTitle>
                    <CardDescription>Instructions for connecting your custom domain</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-medium mb-3">Required DNS Records</h4>
                        <div className="space-y-2 font-mono text-sm">
                          <div className="flex items-center gap-4 p-2 bg-background rounded border border-border">
                            <Badge variant="secondary">A</Badge>
                            <span className="text-muted-foreground">@</span>
                            <span className="flex-1">185.158.133.1</span>
                          </div>
                          <div className="flex items-center gap-4 p-2 bg-background rounded border border-border">
                            <Badge variant="secondary">A</Badge>
                            <span className="text-muted-foreground">www</span>
                            <span className="flex-1">185.158.133.1</span>
                          </div>
                          <div className="flex items-center gap-4 p-2 bg-background rounded border border-border">
                            <Badge variant="secondary">TXT</Badge>
                            <span className="text-muted-foreground">_zenith</span>
                            <span className="flex-1 truncate">zenith_verify={tenant?.id || 'your-verification-code'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        <AlertTriangle size={20} className="text-yellow-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-yellow-600">DNS Propagation</p>
                          <p className="text-sm text-muted-foreground">
                            DNS changes can take up to 72 hours to propagate. SSL certificates will be automatically provisioned once verified.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Data Safety Notice */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2"
              >
                <Card className="bg-green-500/5 border-green-500/20">
                  <CardContent className="py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <Shield size={24} className="text-green-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">Your Data is Always Safe</h3>
                        <p className="text-sm text-muted-foreground">
                          No lock-in. Export your data anytime. Your content, settings, and media are always yours. 
                          Full data portability guaranteed.
                        </p>
                      </div>
                      <Button variant="outline">
                        Export Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}