import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Palette, 
  Globe, 
  GraduationCap, 
  Zap,
  TrendingUp,
  Users,
  FolderOpen,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const studioData: Record<string, {
  icon: React.ElementType;
  color: string;
  stats: { label: string; value: string; trend?: string }[];
  quickActions: { label: string; icon: React.ElementType }[];
  recentItems: { title: string; date: string; status: string }[];
}> = {
  cms: {
    icon: FileText,
    color: 'text-blue-500',
    stats: [
      { label: 'Total Articles', value: '1,284', trend: '+12%' },
      { label: 'Published', value: '892', trend: '+5%' },
      { label: 'Drafts', value: '156' },
      { label: 'Media Files', value: '2,340', trend: '+8%' },
    ],
    quickActions: [
      { label: 'New Article', icon: FileText },
      { label: 'Upload Media', icon: FolderOpen },
    ],
    recentItems: [
      { title: 'Getting Started Guide', date: '2 hours ago', status: 'Published' },
      { title: 'Product Announcement', date: '5 hours ago', status: 'Draft' },
      { title: 'Team Updates Q4', date: 'Yesterday', status: 'Published' },
    ],
  },
  canvas: {
    icon: Palette,
    color: 'text-purple-500',
    stats: [
      { label: 'Templates', value: '48', trend: '+3' },
      { label: 'Components', value: '156' },
      { label: 'Assets', value: '892' },
      { label: 'Themes', value: '12' },
    ],
    quickActions: [
      { label: 'New Template', icon: Palette },
      { label: 'Create Component', icon: FolderOpen },
    ],
    recentItems: [
      { title: 'Hero Section v2', date: '1 hour ago', status: 'Active' },
      { title: 'Pricing Card', date: '3 hours ago', status: 'Draft' },
      { title: 'Footer Template', date: 'Yesterday', status: 'Active' },
    ],
  },
  website: {
    icon: Globe,
    color: 'text-green-500',
    stats: [
      { label: 'Total Pages', value: '32' },
      { label: 'Visitors (30d)', value: '45.2K', trend: '+18%' },
      { label: 'Domains', value: '3' },
      { label: 'Uptime', value: '99.9%' },
    ],
    quickActions: [
      { label: 'New Page', icon: Globe },
      { label: 'View Analytics', icon: TrendingUp },
    ],
    recentItems: [
      { title: 'Homepage Update', date: '30 mins ago', status: 'Live' },
      { title: 'About Page', date: '2 hours ago', status: 'Live' },
      { title: 'Contact Form', date: 'Yesterday', status: 'Draft' },
    ],
  },
  lms: {
    icon: GraduationCap,
    color: 'text-orange-500',
    stats: [
      { label: 'Courses', value: '24' },
      { label: 'Active Students', value: '1,847', trend: '+22%' },
      { label: 'Completion Rate', value: '78%', trend: '+5%' },
      { label: 'Certifications', value: '432' },
    ],
    quickActions: [
      { label: 'New Course', icon: GraduationCap },
      { label: 'Schedule Session', icon: Clock },
    ],
    recentItems: [
      { title: 'Advanced React Patterns', date: '1 hour ago', status: 'Published' },
      { title: 'Design Fundamentals', date: '4 hours ago', status: 'Draft' },
      { title: 'API Masterclass', date: 'Yesterday', status: 'Published' },
    ],
  },
  automation: {
    icon: Zap,
    color: 'text-yellow-500',
    stats: [
      { label: 'Workflows', value: '18' },
      { label: 'Executions (24h)', value: '2,341', trend: '+15%' },
      { label: 'Success Rate', value: '99.2%' },
      { label: 'Time Saved', value: '142h' },
    ],
    quickActions: [
      { label: 'New Workflow', icon: Zap },
      { label: 'View Logs', icon: FolderOpen },
    ],
    recentItems: [
      { title: 'Email Welcome Series', date: '15 mins ago', status: 'Active' },
      { title: 'Lead Scoring', date: '2 hours ago', status: 'Active' },
      { title: 'Data Sync', date: 'Yesterday', status: 'Paused' },
    ],
  },
};

export const StudioContent = () => {
  const { studioType = 'cms' } = useParams();
  const data = studioData[studioType] || studioData.cms;
  const Icon = data.icon;

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-background">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-border rounded-xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center ${data.color}`}>
              <Icon size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Welcome to {studioType.toUpperCase()} Studio</h2>
              <p className="text-muted-foreground text-sm">Manage your content and configurations in one place.</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {data.stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold">{stat.value}</span>
                    {stat.trend && (
                      <span className="text-xs text-green-500 flex items-center">
                        <TrendingUp size={12} className="mr-0.5" />
                        {stat.trend}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card border-border h-full">
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.quickActions.map((action) => (
                  <Button
                    key={action.label}
                    variant="outline"
                    className="w-full justify-start gap-3"
                  >
                    <action.icon size={18} />
                    {action.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="bg-card border-border h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Recent Activity</CardTitle>
                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                  View All
                  <ArrowUpRight size={14} />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.recentItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center">
                          <Icon size={18} className={data.color} />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.date}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.status === 'Published' || item.status === 'Live' || item.status === 'Active'
                          ? 'bg-green-500/10 text-green-500'
                          : item.status === 'Draft'
                          ? 'bg-yellow-500/10 text-yellow-500'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Team Activity (Optional) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Users size={18} />
                Team Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {['A', 'B', 'C', 'D'].map((letter, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-medium"
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  4 team members active in this studio
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
