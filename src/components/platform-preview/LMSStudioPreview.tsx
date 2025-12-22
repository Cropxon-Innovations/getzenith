import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { BookOpen, Play, CheckCircle, Lock, Award, BarChart3, Users, Clock } from 'lucide-react';

const courses = [
  { title: 'React Fundamentals', progress: 85, students: 234, status: 'published' },
  { title: 'Advanced TypeScript', progress: 45, students: 156, status: 'published' },
  { title: 'API Design Patterns', progress: 100, students: 89, status: 'published' },
  { title: 'System Architecture', progress: 20, students: 0, status: 'draft' },
];

const modules = [
  { title: 'Introduction', duration: '15 min', completed: true },
  { title: 'Core Concepts', duration: '45 min', completed: true },
  { title: 'Hands-on Practice', duration: '60 min', completed: false, current: true },
  { title: 'Advanced Topics', duration: '90 min', completed: false, locked: true },
  { title: 'Final Assessment', duration: '30 min', completed: false, locked: true },
];

const AnimatedProgress = ({ value, delay = 0 }: { value: number; delay?: number }) => {
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return (
    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${width}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="h-full bg-primary rounded-full"
      />
    </div>
  );
};

export const LMSStudioPreview = () => {
  const [completionRate, setCompletionRate] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setCompletionRate(78), 500);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="flex h-full">
      {/* Left: Course List */}
      <div className="w-56 bg-muted/30 border-r border-border p-3 overflow-auto">
        <div className="text-xs font-semibold text-muted-foreground mb-3">COURSES</div>
        <div className="space-y-2">
          {courses.map((course, i) => (
            <motion.div
              key={course.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-2.5 rounded border cursor-pointer transition-all ${
                i === 0 ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-foreground truncate">{course.title}</span>
                {course.status === 'draft' && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-muted rounded text-muted-foreground">Draft</span>
                )}
              </div>
              <AnimatedProgress value={course.progress} delay={300 + i * 100} />
              <div className="flex items-center gap-2 mt-1.5">
                <Users size={10} className="text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">{course.students} students</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Center: Course Detail */}
      <div className="flex-1 p-4 overflow-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4"
        >
          <h3 className="text-lg font-semibold text-foreground mb-1">React Fundamentals</h3>
          <p className="text-xs text-muted-foreground">Master React from basics to advanced patterns</p>
        </motion.div>
        
        {/* Modules */}
        <div className="space-y-2 mb-6">
          {modules.map((module, i) => (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className={`flex items-center gap-3 p-3 rounded border transition-colors ${
                module.current 
                  ? 'border-primary bg-primary/5' 
                  : module.locked 
                    ? 'border-border/50 opacity-60' 
                    : 'border-border'
              }`}
            >
              <div className="shrink-0">
                {module.completed ? (
                  <CheckCircle size={18} className="text-primary" />
                ) : module.locked ? (
                  <Lock size={18} className="text-muted-foreground" />
                ) : (
                  <motion.div
                    animate={module.current ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Play size={18} className="text-primary" />
                  </motion.div>
                )}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">{module.title}</div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock size={10} />
                  <span>{module.duration}</span>
                </div>
              </div>
              {module.current && (
                <div className="px-2 py-0.5 bg-primary text-primary-foreground text-[10px] rounded-full">
                  In Progress
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Certificate indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="p-4 rounded-lg border border-border bg-card"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ 
                boxShadow: ['0 0 0px hsl(var(--primary) / 0)', '0 0 20px hsl(var(--primary) / 0.5)', '0 0 0px hsl(var(--primary) / 0)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-2 rounded-full bg-muted"
            >
              <Award size={24} className="text-muted-foreground" />
            </motion.div>
            <div>
              <div className="text-sm font-medium text-foreground">Certificate Locked</div>
              <div className="text-xs text-muted-foreground">Complete all modules to unlock</div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Right: Analytics Panel */}
      <div className="w-48 bg-muted/30 border-l border-border p-3">
        <div className="text-xs font-semibold text-muted-foreground mb-3">ANALYTICS</div>
        
        <div className="space-y-4">
          {/* Completion Rate */}
          <div className="bg-card border border-border rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 size={12} className="text-primary" />
              <span className="text-xs text-muted-foreground">Completion Rate</span>
            </div>
            <div className="relative h-20 flex items-end justify-center">
              <svg viewBox="0 0 36 36" className="w-16 h-16">
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke="hsl(var(--muted))"
                  strokeWidth="3"
                />
                <motion.circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                  strokeDasharray={`${completionRate} ${100 - completionRate}`}
                  strokeDashoffset="25"
                  initial={{ strokeDasharray: '0 100' }}
                  animate={{ strokeDasharray: `${completionRate} ${100 - completionRate}` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-foreground">{completionRate}%</span>
              </div>
            </div>
          </div>
          
          {/* Engagement Timeline (simplified) */}
          <div className="bg-card border border-border rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-2">Weekly Activity</div>
            <div className="flex items-end gap-1 h-12">
              {[30, 45, 25, 60, 80, 55, 70].map((value, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-primary/60 rounded-t"
                  initial={{ height: 0 }}
                  animate={{ height: `${value}%` }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1 text-[8px] text-muted-foreground">
              <span>Mon</span>
              <span>Sun</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};