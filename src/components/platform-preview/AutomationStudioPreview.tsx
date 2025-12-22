import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { UserPlus, Clock, Mail, MessageSquare, CheckCircle, Play, AlertCircle, Zap } from 'lucide-react';

const automationKits = [
  { title: 'New User Onboarding', icon: UserPlus, runs: 1247 },
  { title: 'Course Completion Follow-up', icon: CheckCircle, runs: 892 },
  { title: 'Payment Failure Reminder', icon: AlertCircle, runs: 156 },
];

const flowSteps = [
  { type: 'trigger', label: 'User Enrolls', icon: UserPlus, status: 'completed' },
  { type: 'delay', label: 'Wait 1 Day', icon: Clock, status: 'completed' },
  { type: 'action', label: 'Send Email', icon: Mail, status: 'running' },
  { type: 'action', label: 'Send WhatsApp', icon: MessageSquare, status: 'pending' },
];

const executionLogs = [
  { time: '2s ago', event: 'Email sent to john@example.com', status: 'success' },
  { time: '5s ago', event: 'Delay completed (24h)', status: 'success' },
  { time: '1d ago', event: 'Workflow triggered', status: 'success' },
];

export const AutomationStudioPreview = () => {
  const [selectedKit, setSelectedKit] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  
  // Auto-select first kit after a delay
  useEffect(() => {
    const timer = setTimeout(() => setSelectedKit(0), 800);
    return () => clearTimeout(timer);
  }, []);
  
  // Animate flow steps
  useEffect(() => {
    if (selectedKit !== null) {
      const interval = setInterval(() => {
        setActiveStep(prev => (prev + 1) % flowSteps.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [selectedKit]);
  
  // Update logs
  useEffect(() => {
    if (selectedKit !== null) {
      const interval = setInterval(() => {
        setLogIndex(prev => (prev + 1) % 3);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedKit]);
  
  return (
    <div className="flex h-full">
      {/* Left: Automation Kits */}
      <div className="w-56 bg-muted/30 border-r border-border p-3">
        <div className="text-xs font-semibold text-muted-foreground mb-3">AUTOMATION KITS</div>
        <div className="space-y-2">
          {automationKits.map((kit, i) => (
            <motion.div
              key={kit.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedKit(i)}
              className={`p-3 rounded border cursor-pointer transition-all ${
                selectedKit === i 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <kit.icon size={16} className={selectedKit === i ? 'text-primary' : 'text-muted-foreground'} />
                <span className="text-xs font-medium text-foreground">{kit.title}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Zap size={10} />
                <span>{kit.runs.toLocaleString()} runs</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Center: Flow Visualization */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center">
        {selectedKit === null ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <Zap size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Select an automation kit to view</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-xs"
          >
            <div className="text-center mb-6">
              <h4 className="text-sm font-semibold text-foreground">{automationKits[selectedKit].title}</h4>
              <div className="flex items-center justify-center gap-2 mt-1">
                <motion.div
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-xs text-primary">Running</span>
              </div>
            </div>
            
            {/* Flow steps */}
            <div className="space-y-3">
              {flowSteps.map((step, i) => {
                const isActive = i === activeStep;
                const isCompleted = i < activeStep;
                
                return (
                  <div key={step.label}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className={`relative flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        isActive 
                          ? 'border-primary bg-primary/10' 
                          : isCompleted 
                            ? 'border-primary/50 bg-primary/5' 
                            : 'border-border'
                      }`}
                    >
                      <motion.div
                        animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
                        className={`p-2 rounded-full ${
                          isCompleted ? 'bg-primary' : isActive ? 'bg-primary' : 'bg-muted'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle size={16} className="text-primary-foreground" />
                        ) : (
                          <step.icon size={16} className={isActive ? 'text-primary-foreground' : 'text-muted-foreground'} />
                        )}
                      </motion.div>
                      <div className="flex-1">
                        <div className="text-xs text-muted-foreground uppercase">{step.type}</div>
                        <div className="text-sm font-medium text-foreground">{step.label}</div>
                      </div>
                      {isActive && (
                        <motion.div
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="text-xs text-primary"
                        >
                          Processing...
                        </motion.div>
                      )}
                    </motion.div>
                    
                    {/* Connector line */}
                    {i < flowSteps.length - 1 && (
                      <div className="flex justify-center py-1">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 16 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          className={`w-0.5 ${isCompleted ? 'bg-primary' : 'bg-border'}`}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Right: Execution Panel */}
      <div className="w-52 bg-muted/30 border-l border-border p-3">
        <div className="text-xs font-semibold text-muted-foreground mb-3">EXECUTION</div>
        
        {selectedKit !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Status */}
            <div className="bg-card border border-border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Status</span>
                <div className="flex items-center gap-1">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-xs text-primary">Running</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Step</span>
                <span className="text-xs text-foreground">{activeStep + 1} of {flowSteps.length}</span>
              </div>
            </div>
            
            {/* Logs */}
            <div>
              <div className="text-xs text-muted-foreground mb-2">Recent Logs</div>
              <div className="space-y-1.5">
                {executionLogs.map((log, i) => (
                  <motion.div
                    key={`${log.event}-${i}`}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: i === logIndex ? 1 : 0.5, x: 0 }}
                    className="text-[10px] p-2 rounded bg-background border border-border"
                  >
                    <div className="flex items-center gap-1 mb-0.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${log.status === 'success' ? 'bg-primary' : 'bg-destructive'}`} />
                      <span className="text-muted-foreground">{log.time}</span>
                    </div>
                    <div className="text-foreground truncate">{log.event}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};