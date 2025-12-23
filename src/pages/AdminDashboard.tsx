import { useEffect } from 'react';
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
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ZenithLogo } from '@/components/ZenithLogo';

const studios = [
  {
    id: 'cms',
    name: 'CMS Studio',
    description: 'Create and manage content',
    icon: FileText,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    enabled: true,
  },
  {
    id: 'canvas',
    name: 'Canvas Studio',
    description: 'Design visual assets',
    icon: Palette,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    enabled: true,
  },
  {
    id: 'website',
    name: 'Website Builder',
    description: 'Build your website',
    icon: Globe,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    enabled: true,
  },
  {
    id: 'lms',
    name: 'LMS Studio',
    description: 'Create courses & lessons',
    icon: GraduationCap,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    enabled: true,
  },
  {
    id: 'automation',
    name: 'Automation',
    description: 'Automate workflows',
    icon: Zap,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    enabled: false,
    reason: 'Available on Pro plan',
  },
];

const checklistItems = [
  { id: 'content', label: 'Create your first content', completed: false, href: '/studio/cms' },
  { id: 'website', label: 'Publish your website', completed: false, href: '/studio/website' },
  { id: 'users', label: 'Invite team members', completed: false, href: '/admin/team' },
  { id: 'automation', label: 'Set up automation', completed: false, href: '/studio/automation' },
];

export default function AdminDashboard() {
  const { user, profile, tenant, signOut, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    } else if (!isLoading && profile && !profile.onboarding_completed) {
      navigate('/admin/onboarding');
    }
  }, [user, profile, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <ZenithLogo size={48} />
        </div>
      </div>
    );
  }

  const completedCount = checklistItems.filter(item => item.completed).length;
  const progress = (completedCount / checklistItems.length) * 100;

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
          
          <div className="flex items-center gap-4">
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
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}!
          </h2>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your platform
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Studios Grid */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-foreground mb-4">Your Studios</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {studios.map((studio, index) => (
                <motion.div
                  key={studio.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`relative overflow-hidden transition-all hover:shadow-lg ${
                    studio.enabled ? 'hover:border-primary/50 cursor-pointer' : 'opacity-60'
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
                          <div className="flex items-center text-sm text-primary">
                            Open Studio
                            <ArrowRight size={14} className="ml-1" />
                          </div>
                        </CardContent>
                      </Link>
                    ) : (
                      <>
                        <CardHeader className="pb-2">
                          <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-2`}>
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Onboarding Checklist */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Getting Started</CardTitle>
                <CardDescription>Complete these steps to launch</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={progress} className="h-2 mb-4" />
                <ul className="space-y-3">
                  {checklistItems.map((item) => (
                    <li key={item.id}>
                      <Link
                        to={item.href}
                        className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          item.completed 
                            ? 'bg-primary border-primary' 
                            : 'border-muted-foreground'
                        }`}>
                          {item.completed && <Check size={12} className="text-primary-foreground" />}
                        </div>
                        <span className={item.completed ? 'line-through text-muted-foreground' : ''}>
                          {item.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Stats</CardTitle>
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
                    <BarChart3 size={16} />
                    Page Views
                  </div>
                  <span className="font-semibold">0</span>
                </div>
              </CardContent>
            </Card>

            {/* Plan Info */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Trial Plan</span>
                  <span className="text-xs text-muted-foreground">30 days left</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Upgrade to unlock all features and automation
                </p>
                <Button size="sm" className="w-full">
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
