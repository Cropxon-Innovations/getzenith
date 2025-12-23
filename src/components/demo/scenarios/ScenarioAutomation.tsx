import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Zap, Mail, Users, Clock, CheckCircle2, 
  ArrowRight, Play, Pause, Bell, MessageSquare,
  Database, Webhook, Filter, GitBranch
} from 'lucide-react';

interface ScenarioProps {
  progress: number;
  isPlaying: boolean;
}

const workflowNodes = [
  { id: 'trigger', type: 'trigger', icon: Bell, label: 'New Signup', x: 50, y: 80 },
  { id: 'delay', type: 'action', icon: Clock, label: 'Wait 1 day', x: 200, y: 80 },
  { id: 'condition', type: 'condition', icon: GitBranch, label: 'Check Status', x: 350, y: 80 },
  { id: 'email', type: 'action', icon: Mail, label: 'Send Email', x: 500, y: 40 },
  { id: 'slack', type: 'action', icon: MessageSquare, label: 'Notify Team', x: 500, y: 120 },
];

const connections = [
  { from: 'trigger', to: 'delay' },
  { from: 'delay', to: 'condition' },
  { from: 'condition', to: 'email' },
  { from: 'condition', to: 'slack' },
];

const executionLogs = [
  { time: '10:45 AM', event: 'Workflow triggered', status: 'success' },
  { time: '10:45 AM', event: 'Delay started (1 day)', status: 'pending' },
  { time: 'Yesterday', event: 'Email sent to user@example.com', status: 'success' },
  { time: 'Yesterday', event: 'Slack notification sent', status: 'success' },
];

export const ScenarioAutomation = ({ progress, isPlaying }: ScenarioProps) => {
  const [visibleNodes, setVisibleNodes] = useState<string[]>([]);
  const [activeConnection, setActiveConnection] = useState(-1);
  const [workflowActive, setWorkflowActive] = useState(false);
  const [executionStep, setExecutionStep] = useState(-1);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    if (progress < 10) {
      setVisibleNodes([]);
    } else if (progress < 20) {
      setVisibleNodes(['trigger']);
    } else if (progress < 30) {
      setVisibleNodes(['trigger', 'delay']);
      setActiveConnection(0);
    } else if (progress < 40) {
      setVisibleNodes(['trigger', 'delay', 'condition']);
      setActiveConnection(1);
    } else if (progress < 50) {
      setVisibleNodes(['trigger', 'delay', 'condition', 'email', 'slack']);
      setActiveConnection(2);
    } else if (progress < 60) {
      setActiveConnection(3);
      setWorkflowActive(true);
    } else if (progress < 70) {
      setExecutionStep(0);
    } else if (progress < 80) {
      setExecutionStep(1);
    } else if (progress < 90) {
      setExecutionStep(2);
    } else {
      setExecutionStep(3);
      setShowStats(true);
    }
  }, [progress]);

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'trigger': return '#F59E0B';
      case 'condition': return '#8B5CF6';
      case 'action': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  return (
    <div className="h-full flex">
      {/* Left: Node palette */}
      <div className="w-56 border-r border-border bg-muted/20 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={18} className="text-primary" />
          <span className="text-sm font-semibold">Automation</span>
        </div>

        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Triggers
        </div>
        <div className="space-y-2 mb-4">
          {[
            { icon: Bell, label: 'New Signup' },
            { icon: Webhook, label: 'Webhook' },
            { icon: Clock, label: 'Schedule' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-2 p-2 rounded-lg border border-border bg-card hover:border-primary/50 cursor-pointer transition-colors"
            >
              <div className="w-7 h-7 rounded bg-yellow-500/20 flex items-center justify-center">
                <item.icon size={14} className="text-yellow-500" />
              </div>
              <span className="text-xs">{item.label}</span>
            </motion.div>
          ))}
        </div>

        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Actions
        </div>
        <div className="space-y-2">
          {[
            { icon: Mail, label: 'Send Email' },
            { icon: MessageSquare, label: 'Send Slack' },
            { icon: Database, label: 'Update Record' },
            { icon: Filter, label: 'Filter' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-2 p-2 rounded-lg border border-border bg-card hover:border-primary/50 cursor-pointer transition-colors"
            >
              <div className="w-7 h-7 rounded bg-blue-500/20 flex items-center justify-center">
                <item.icon size={14} className="text-blue-500" />
              </div>
              <span className="text-xs">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Center: Canvas */}
      <div className="flex-1 p-6 relative overflow-hidden bg-[radial-gradient(circle_at_center,hsl(var(--muted))_1px,transparent_1px)] bg-[length:20px_20px]">
        {/* Workflow name */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">Welcome Series Automation</span>
          <motion.div
            animate={workflowActive ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 1, repeat: workflowActive ? Infinity : 0 }}
            className={`w-2 h-2 rounded-full ${workflowActive ? 'bg-green-500' : 'bg-muted-foreground'}`}
          />
        </div>

        {/* SVG for connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="hsl(var(--primary))"
              />
            </marker>
          </defs>
          
          {connections.map((conn, i) => {
            const fromNode = workflowNodes.find(n => n.id === conn.from);
            const toNode = workflowNodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;
            
            const isVisible = visibleNodes.includes(conn.from) && visibleNodes.includes(conn.to);
            const isActive = activeConnection >= i;

            return (
              <motion.line
                key={`${conn.from}-${conn.to}`}
                x1={fromNode.x + 60}
                y1={fromNode.y + 25}
                x2={toNode.x}
                y2={toNode.y + 25}
                stroke={isActive ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
                strokeWidth="2"
                strokeDasharray={isActive ? '0' : '5,5'}
                markerEnd={isActive ? 'url(#arrowhead)' : ''}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isVisible ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.2 }}
              />
            );
          })}

          {/* Animated pulse along active connection */}
          {workflowActive && executionStep >= 0 && (
            <motion.circle
              r="5"
              fill="hsl(var(--primary))"
              animate={{
                cx: [110, 260, 410, 560],
                cy: [105, 105, 105, executionStep >= 2 ? 65 : 145],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )}
        </svg>

        {/* Nodes */}
        {workflowNodes.map((node) => {
          const isVisible = visibleNodes.includes(node.id);
          const isExecuting = workflowActive && (
            (executionStep === 0 && node.id === 'trigger') ||
            (executionStep === 1 && node.id === 'delay') ||
            (executionStep === 2 && node.id === 'condition') ||
            (executionStep >= 3 && (node.id === 'email' || node.id === 'slack'))
          );

          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              style={{
                position: 'absolute',
                left: node.x,
                top: node.y,
                zIndex: 10,
              }}
            >
              <motion.div
                animate={isExecuting ? {
                  boxShadow: [`0 0 0 0 ${getNodeColor(node.type)}40`, `0 0 0 8px ${getNodeColor(node.type)}00`],
                } : {}}
                transition={{ duration: 1, repeat: isExecuting ? Infinity : 0 }}
                className="p-3 rounded-xl border-2 bg-card shadow-lg"
                style={{ borderColor: getNodeColor(node.type) }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${getNodeColor(node.type)}20` }}
                  >
                    <node.icon size={16} style={{ color: getNodeColor(node.type) }} />
                  </div>
                  <span className="text-xs font-medium whitespace-nowrap">{node.label}</span>
                </div>
                {isExecuting && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1 }}
                    className="h-0.5 mt-2 rounded-full"
                    style={{ backgroundColor: getNodeColor(node.type) }}
                  />
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Right: Execution logs */}
      <div className="w-64 border-l border-border bg-muted/20 p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Execution Log
          </span>
          {workflowActive && (
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="flex items-center gap-1 text-xs text-green-500"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Live
            </motion.div>
          )}
        </div>

        <div className="space-y-2">
          {executionLogs.slice(0, executionStep + 1).map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-2 rounded-lg border border-border bg-card"
            >
              <div className="flex items-center gap-2 mb-1">
                {log.status === 'success' ? (
                  <CheckCircle2 size={12} className="text-green-500" />
                ) : (
                  <Clock size={12} className="text-yellow-500" />
                )}
                <span className="text-[10px] text-muted-foreground">{log.time}</span>
              </div>
              <span className="text-xs text-foreground">{log.event}</span>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 space-y-3"
            >
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Performance
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-card border border-border text-center">
                  <span className="text-lg font-bold text-primary">156</span>
                  <span className="text-[10px] text-muted-foreground block">Executions</span>
                </div>
                <div className="p-2 rounded-lg bg-card border border-border text-center">
                  <span className="text-lg font-bold text-green-500">98%</span>
                  <span className="text-[10px] text-muted-foreground block">Success</span>
                </div>
              </div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="p-3 rounded-lg bg-primary/10 border border-primary/30 flex items-center gap-2"
              >
                <Zap size={16} className="text-primary" />
                <span className="text-xs font-medium text-primary">Workflow Active!</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
