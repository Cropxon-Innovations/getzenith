import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Users, FileText, GraduationCap, Zap, TrendingUp, Activity } from 'lucide-react';

const metrics = [
  { label: 'Active Users', value: 2847, icon: Users, change: '+12%' },
  { label: 'Content Published', value: 156, icon: FileText, change: '+8%' },
  { label: 'Courses Live', value: 24, icon: GraduationCap, change: '+3%' },
  { label: 'Automations', value: 18, icon: Zap, change: '+15%' },
];

const activityFeed = [
  { action: 'New user registered', time: '2s ago', type: 'user' },
  { action: 'Course "React Basics" completed', time: '15s ago', type: 'course' },
  { action: 'Automation triggered: Welcome Email', time: '32s ago', type: 'automation' },
  { action: 'Content published: API Guide', time: '1m ago', type: 'content' },
  { action: 'New enrollment in "Advanced CSS"', time: '2m ago', type: 'course' },
  { action: 'Payment received: $299', time: '3m ago', type: 'payment' },
];

const AnimatedCounter = ({ value, duration = 2 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = value;
    const incrementTime = (duration * 1000) / end;
    const timer = setInterval(() => {
      start += Math.ceil(end / 50);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value, duration]);
  
  return <span>{count.toLocaleString()}</span>;
};

const MiniLineChart = () => {
  const points = [20, 35, 28, 45, 38, 52, 48, 65, 58, 72, 68, 85];
  const maxValue = Math.max(...points);
  const width = 100;
  const height = 40;
  
  const pathData = points
    .map((point, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - (point / maxValue) * height;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
  
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-10">
      <motion.path
        d={pathData}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
      />
    </svg>
  );
};

const MiniBarChart = () => {
  const bars = [45, 65, 35, 80, 55, 70, 40];
  const maxValue = Math.max(...bars);
  
  return (
    <div className="flex items-end gap-1 h-10">
      {bars.map((value, i) => (
        <motion.div
          key={i}
          className="flex-1 bg-primary/60 rounded-t"
          initial={{ height: 0 }}
          animate={{ height: `${(value / maxValue) * 100}%` }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
        />
      ))}
    </div>
  );
};

const MiniPieChart = () => {
  const segments = [
    { value: 40, color: 'hsl(var(--primary))' },
    { value: 30, color: 'hsl(var(--accent))' },
    { value: 20, color: 'hsl(var(--muted-foreground))' },
    { value: 10, color: 'hsl(var(--border))' },
  ];
  
  let cumulativePercent = 0;
  
  return (
    <svg viewBox="0 0 36 36" className="w-12 h-12">
      {segments.map((segment, i) => {
        const dashArray = `${segment.value} ${100 - segment.value}`;
        const dashOffset = 100 - cumulativePercent + 25;
        cumulativePercent += segment.value;
        
        return (
          <motion.circle
            key={i}
            cx="18"
            cy="18"
            r="15.915"
            fill="transparent"
            stroke={segment.color}
            strokeWidth="3"
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.2, duration: 0.5 }}
          />
        );
      })}
    </svg>
  );
};

export const TenantAdminPreview = () => {
  const [activityIndex, setActivityIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActivityIndex(prev => (prev + 1) % activityFeed.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-48 bg-muted/30 border-r border-border p-3">
        <div className="text-xs font-semibold text-muted-foreground mb-3">ADMIN</div>
        <div className="space-y-1">
          {['Dashboard', 'Users', 'Content', 'Courses', 'Automations', 'Settings'].map((item, i) => (
            <div 
              key={item} 
              className={`px-3 py-2 rounded text-sm ${i === 0 ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50'}`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-4 overflow-hidden">
        {/* Metrics */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <metric.icon size={16} className="text-muted-foreground" />
                <span className="text-xs text-primary">{metric.change}</span>
              </div>
              <div className="text-xl font-bold text-foreground">
                <AnimatedCounter value={metric.value} />
              </div>
              <div className="text-xs text-muted-foreground">{metric.label}</div>
            </motion.div>
          ))}
        </div>
        
        {/* Charts row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-card border border-border rounded-lg p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={14} className="text-primary" />
              <span className="text-xs font-medium text-foreground">User Growth</span>
            </div>
            <MiniLineChart />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-card border border-border rounded-lg p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <Activity size={14} className="text-primary" />
              <span className="text-xs font-medium text-foreground">Engagement</span>
            </div>
            <MiniBarChart />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-card border border-border rounded-lg p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-foreground">Studio Usage</span>
            </div>
            <div className="flex items-center gap-3">
              <MiniPieChart />
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">CMS 40%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-muted-foreground">LMS 30%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Activity and Status */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-card border border-border rounded-lg p-3"
          >
            <div className="text-xs font-medium text-foreground mb-2">Recent Activity</div>
            <div className="space-y-2 h-32 overflow-hidden">
              {activityFeed.slice(activityIndex, activityIndex + 4).map((activity, i) => (
                <motion.div
                  key={`${activity.action}-${activityIndex}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-muted-foreground truncate">{activity.action}</span>
                  <span className="text-muted-foreground/60 shrink-0 ml-2">{activity.time}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="bg-card border border-border rounded-lg p-3"
          >
            <div className="text-xs font-medium text-foreground mb-2">System Status</div>
            <div className="space-y-2">
              {['API Gateway', 'Database', 'CDN', 'Auth Service'].map((service, i) => (
                <div key={service} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{service}</span>
                  <div className="flex items-center gap-1">
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-primary"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ delay: i * 0.2, duration: 2, repeat: Infinity }}
                    />
                    <span className="text-primary text-xs">Healthy</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};