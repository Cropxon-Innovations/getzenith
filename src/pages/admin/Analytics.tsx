import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  FileText,
  Clock,
  Globe,
  MousePointerClick,
  ArrowUpRight,
  Calendar,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminLayout } from '@/components/admin/AdminLayout';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data for charts
const pageViewsData = [
  { name: 'Mon', views: 1200, visitors: 890 },
  { name: 'Tue', views: 1900, visitors: 1200 },
  { name: 'Wed', views: 1500, visitors: 1100 },
  { name: 'Thu', views: 2100, visitors: 1400 },
  { name: 'Fri', views: 2400, visitors: 1600 },
  { name: 'Sat', views: 1800, visitors: 1200 },
  { name: 'Sun', views: 1400, visitors: 900 },
];

const contentPerformance = [
  { name: 'Blog Posts', value: 45, color: 'hsl(217, 91%, 55%)' },
  { name: 'Courses', value: 28, color: 'hsl(142, 76%, 45%)' },
  { name: 'Pages', value: 18, color: 'hsl(280, 65%, 55%)' },
  { name: 'Media', value: 9, color: 'hsl(35, 92%, 50%)' },
];

const userActivityData = [
  { name: 'Week 1', active: 120, new: 45 },
  { name: 'Week 2', active: 150, new: 52 },
  { name: 'Week 3', active: 180, new: 68 },
  { name: 'Week 4', active: 220, new: 85 },
];

const growthData = [
  { month: 'Jan', users: 120, revenue: 2400 },
  { month: 'Feb', users: 180, revenue: 3200 },
  { month: 'Mar', users: 250, revenue: 4100 },
  { month: 'Apr', users: 320, revenue: 5200 },
  { month: 'May', users: 410, revenue: 6800 },
  { month: 'Jun', users: 520, revenue: 8400 },
];

const topContent = [
  { title: 'Getting Started Guide', views: 2450, change: 12.5 },
  { title: 'Product Launch Announcement', views: 1890, change: 8.3 },
  { title: 'Tutorial: Advanced Features', views: 1540, change: -2.1 },
  { title: 'Company Culture Blog', views: 1230, change: 15.8 },
  { title: 'API Documentation', views: 980, change: 5.4 },
];

const trafficSources = [
  { source: 'Organic Search', visitors: 4520, percentage: 42 },
  { source: 'Direct', visitors: 2890, percentage: 27 },
  { source: 'Social Media', visitors: 1780, percentage: 16 },
  { source: 'Referral', visitors: 980, percentage: 9 },
  { source: 'Email', visitors: 630, percentage: 6 },
];

export default function Analytics() {
  const stats = [
    { 
      label: 'Total Page Views', 
      value: '24.5K', 
      change: '+12.5%', 
      trend: 'up',
      icon: Eye,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    { 
      label: 'Unique Visitors', 
      value: '8,420', 
      change: '+8.2%', 
      trend: 'up',
      icon: Users,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    { 
      label: 'Content Items', 
      value: '156', 
      change: '+24', 
      trend: 'up',
      icon: FileText,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    { 
      label: 'Avg. Session', 
      value: '4m 32s', 
      change: '-0.8%', 
      trend: 'down',
      icon: Clock,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground">Track your platform performance and growth</p>
          </div>
          <div className="flex items-center gap-3">
            <Select defaultValue="7d">
              <SelectTrigger className="w-[140px]">
                <Calendar size={16} className="mr-2" />
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                      <stat.icon size={20} className={stat.color} />
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={stat.trend === 'up' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}
                    >
                      {stat.trend === 'up' ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="growth">Growth</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Page Views Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye size={18} className="text-primary" />
                    Page Views & Visitors
                  </CardTitle>
                  <CardDescription>Daily traffic over the last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={pageViewsData}>
                        <defs>
                          <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(217, 91%, 55%)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(217, 91%, 55%)" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(142, 76%, 45%)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(142, 76%, 45%)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="name" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }} 
                        />
                        <Area type="monotone" dataKey="views" stroke="hsl(217, 91%, 55%)" fillOpacity={1} fill="url(#colorViews)" />
                        <Area type="monotone" dataKey="visitors" stroke="hsl(142, 76%, 45%)" fillOpacity={1} fill="url(#colorVisitors)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Content Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText size={18} className="text-primary" />
                    Content Distribution
                  </CardTitle>
                  <CardDescription>Breakdown by content type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={contentPerformance}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {contentPerformance.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {contentPerformance.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-muted-foreground">{item.name}</span>
                        <span className="text-sm font-medium ml-auto">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* User Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users size={18} className="text-primary" />
                  User Activity
                </CardTitle>
                <CardDescription>Active vs new users over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userActivityData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="name" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="active" fill="hsl(217, 91%, 55%)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="new" fill="hsl(142, 76%, 45%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="traffic" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Traffic Sources */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe size={18} className="text-primary" />
                    Traffic Sources
                  </CardTitle>
                  <CardDescription>Where your visitors come from</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trafficSources.map((source, index) => (
                      <motion.div
                        key={source.source}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{source.source}</span>
                          <span className="text-sm text-muted-foreground">{source.visitors.toLocaleString()} visitors</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${source.percentage}%` }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="h-full bg-primary rounded-full"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MousePointerClick size={18} className="text-primary" />
                    Top Performing Content
                  </CardTitle>
                  <CardDescription>Most viewed content this period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topContent.map((content, index) => (
                      <motion.div
                        key={content.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium truncate max-w-[200px]">{content.title}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">{content.views.toLocaleString()}</span>
                          <Badge 
                            variant="secondary" 
                            className={content.change > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}
                          >
                            {content.change > 0 ? '+' : ''}{content.change}%
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Published Content</CardTitle>
                  <CardDescription>Total published items</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-foreground">156</div>
                  <p className="text-sm text-muted-foreground mt-1">+24 this month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Draft Content</CardTitle>
                  <CardDescription>Items in progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-foreground">23</div>
                  <p className="text-sm text-muted-foreground mt-1">8 scheduled</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Media Files</CardTitle>
                  <CardDescription>Total media items</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-foreground">412</div>
                  <p className="text-sm text-muted-foreground mt-1">2.4 GB used</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="growth" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-primary" />
                  Growth Metrics
                </CardTitle>
                <CardDescription>User and revenue growth over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={growthData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis yAxisId="left" className="text-xs" />
                      <YAxis yAxisId="right" orientation="right" className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Line yAxisId="left" type="monotone" dataKey="users" stroke="hsl(217, 91%, 55%)" strokeWidth={2} dot={{ r: 4 }} />
                      <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="hsl(142, 76%, 45%)" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-8 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm text-muted-foreground">Users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm text-muted-foreground">Revenue ($)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}