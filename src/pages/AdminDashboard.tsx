import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Palette,
  Globe,
  GraduationCap,
  Zap,
  Check,
  Lock,
  ArrowRight,
  Users,
  BarChart3,
  Settings,
  TrendingUp,
  Eye,
  Clock,
  Activity,
  Plus,
  Calendar,
  Bell,
  Mail,
  Phone,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ZenithLogo } from '@/components/ZenithLogo';
import { VerificationBadge, VerificationStatusCard, VerificationStatus } from '@/components/admin/VerificationBadge';
import { useToast } from '@/hooks/use-toast';

const studios = [
  { id: 'cms', name: 'CMS Studio', description: 'Create and manage content', icon: FileText, color: 'text-blue-500', bgColor: 'bg-blue-500/10', enabled: true },
  { id: 'canvas', name: 'Canvas Studio', description: 'Design visual assets', icon: Palette, color: 'text-purple-500', bgColor: 'bg-purple-500/10', enabled: true },
  { id: 'website', name: 'Website Builder', description: 'Build your website', icon: Globe, color: 'text-green-500', bgColor: 'bg-green-500/10', enabled: true },
  { id: 'lms', name: 'LMS Studio', description: 'Create courses & lessons', icon: GraduationCap, color: 'text-orange-500', bgColor: 'bg-orange-500/10', enabled: true },
  { id: 'automation', name: 'Automation', description: 'Automate workflows', icon: Zap, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', enabled: false, reason: 'Available on Pro plan' },
];

const checklistItems = [
  { id: 'content', label: 'Create your first content', completed: false, href: '/studio/cms' },
  { id: 'website', label: 'Publish your website', completed: false, href: '/studio/website' },
  { id: 'users', label: 'Invite team members', completed: false, href: '/admin/team' },
  { id: 'automation', label: 'Set up automation', completed: false, href: '/studio/automation' },
];

const recentActivity = [
  { id: 1, action: 'Workspace created', time: 'Just now', icon: Plus, color: 'text-green-500' },
  { id: 2, action: 'Account verified', time: '2 minutes ago', icon: Check, color: 'text-blue-500' },
  { id: 3, action: 'Onboarding completed', time: '5 minutes ago', icon: Activity, color: 'text-purple-500' },
];

export default function AdminDashboard() {
  const { user, profile, tenant, signOut, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [animatedStats, setAnimatedStats] = useState({ content: 0, users: 0, views: 0, growth: 0 });
  
  // Determine verification statuses
  const emailStatus: VerificationStatus = user?.email_confirmed_at ? 'verified' : 'pending';
  const phoneStatus: VerificationStatus = user?.phone_confirmed_at ? 'verified' : 'unverified';

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    } else if (!isLoading && profile && !profile.onboarding_completed) {
      navigate('/admin/onboarding');
    }
  }, [user, profile, isLoading, navigate]);
  
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

  // Animate stats on mount
  useEffect(() => {
    const targets = { content: 0, users: 1, views: 0, growth: 0 };
    const duration = 1000;
    const steps = 20;
    const interval = duration / steps;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      setAnimatedStats({
        content: Math.round((targets.content * step) / steps),
        users: Math.round((targets.users * step) / steps),
        views: Math.round((targets.views * step) / steps),
        growth: Math.round((targets.growth * step) / steps),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
          <ZenithLogo size={48} />
        </motion.div>
      </div>
    );
  }

  const completedCount = checklistItems.filter(item => item.completed).length;
  const progress = (completedCount / checklistItems.length) * 100;
  const trialDaysLeft = tenant?.trial_ends_at 
    ? Math.max(0, Math.ceil((new Date(tenant.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 30;

  const stats = [
    { label: 'Content Items', value: animatedStats.content, icon: FileText, color: 'text-blue-500', bgColor: 'bg-blue-500/10', change: '+0%' },
    { label: 'Team Members', value: animatedStats.users, icon: Users, color: 'text-green-500', bgColor: 'bg-green-500/10', change: '+100%' },
    { label: 'Page Views', value: animatedStats.views, icon: Eye, color: 'text-purple-500', bgColor: 'bg-purple-500/10', change: '+0%' },
    { label: 'Growth', value: `${animatedStats.growth}%`, icon: TrendingUp, color: 'text-orange-500', bgColor: 'bg-orange-500/10', change: '+0%' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ZenithLogo size={32} />
            <div>
              <h1 className="font-semibold text-foreground">{tenant?.name || 'Dashboard'}</h1>
              <p className="text-xs text-muted-foreground">{tenant?.subdomain}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Verification Badges */}
            <div className="hidden sm:flex items-center gap-2">
              <VerificationBadge type="email" status={emailStatus} size="sm" />
              <VerificationBadge type="phone" status={phoneStatus} size="sm" />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/settings">
                <Settings size={18} className="mr-2" />
                Settings
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}! 👋
              </h2>
              <p className="text-muted-foreground mt-1">
                Here's what's happening with your platform today
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar size={16} />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                      <stat.icon size={20} className={stat.color} />
                    </div>
                    <span className="text-xs font-medium text-green-500">{stat.change}</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Studios Grid */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Your Studios</h3>
              <Button variant="outline" size="sm">
                <Plus size={16} className="mr-2" />
                Add Module
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {studios.map((studio, index) => (
                <motion.div
                  key={studio.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: studio.enabled ? 1.02 : 1 }}
                >
                  <Card className={`relative overflow-hidden transition-all ${
                    studio.enabled ? 'hover:shadow-lg hover:border-primary/50 cursor-pointer' : 'opacity-60'
                  }`}>
                    {studio.enabled ? (
                      <Link to={`/studio/${studio.id}`} className="block">
                        <CardHeader className="pb-2">
                          <div className={`w-10 h-10 rounded-lg ${studio.bgColor} flex items-center justify-center mb-2`}>
                            <studio.icon size={20} className={studio.color} />
                          </div>
                          <CardTitle className="text-base">{studio.name}</CardTitle>
                          <CardDescription className="text-sm">{studio.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center text-sm text-primary font-medium">
                            Open Studio
                            <ArrowRight size={14} className="ml-1" />
                          </div>
                        </CardContent>
                      </Link>
                    ) : (
                      <>
                        <CardHeader className="pb-2">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-2">
                            <Lock size={20} className="text-muted-foreground" />
                          </div>
                          <CardTitle className="text-base text-muted-foreground">{studio.name}</CardTitle>
                          <CardDescription className="text-sm">{studio.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <span className="text-xs text-muted-foreground">{studio.reason}</span>
                        </CardContent>
                      </>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs">View All</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center`}>
                        <activity.icon size={14} className={activity.color} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Verification Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <VerificationStatusCard
                emailStatus={emailStatus}
                phoneStatus={phoneStatus}
                email={user?.email}
                phone={user?.phone}
                onVerifyEmail={handleVerifyEmail}
                onVerifyPhone={handleVerifyPhone}
              />
            </motion.div>
            
            {/* Getting Started Checklist */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity size={18} className="text-primary" />
                  Getting Started
                </CardTitle>
                <CardDescription>Complete these steps to launch</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-muted-foreground">{completedCount} of {checklistItems.length} complete</span>
                  <span className="font-medium text-foreground">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2 mb-4" />
                <ul className="space-y-3">
                  {checklistItems.map((item, index) => (
                    <motion.li 
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <Link
                        to={item.href}
                        className="flex items-center gap-3 text-sm hover:text-primary transition-colors group"
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          item.completed 
                            ? 'bg-primary border-primary' 
                            : 'border-muted-foreground group-hover:border-primary'
                        }`}>
                          {item.completed && <Check size={12} className="text-primary-foreground" />}
                        </div>
                        <span className={item.completed ? 'line-through text-muted-foreground' : ''}>
                          {item.label}
                        </span>
                        <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 size={18} className="text-primary" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText size={16} />
                    Content Items
                  </div>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users size={16} />
                    Team Members
                  </div>
                  <span className="font-semibold">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock size={16} />
                    Uptime
                  </div>
                  <span className="font-semibold text-green-500">100%</span>
                </div>
              </CardContent>
            </Card>

            {/* Plan Info */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-foreground">Trial Plan</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-medium">
                    {trialDaysLeft} days left
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Upgrade to unlock all features and automation tools
                </p>
                <Button size="sm" className="w-full">
                  <Zap size={16} className="mr-2" />
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
