import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Play, Pause, RotateCcw, ChevronRight,
  FileText, Globe, GraduationCap, Zap, Users,
  Palette, Send, BarChart3, CheckCircle2
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScenarioWebsiteBuilder } from './scenarios/ScenarioWebsiteBuilder';
import { ScenarioContentPublish } from './scenarios/ScenarioContentPublish';
import { ScenarioLMSCourse } from './scenarios/ScenarioLMSCourse';
import { ScenarioAutomation } from './scenarios/ScenarioAutomation';

interface DemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const scenarios = [
  {
    id: 'website',
    icon: Globe,
    title: 'Design & Launch Website',
    subtitle: 'Visual builder to live site',
    duration: 12000,
    color: 'hsl(217 91% 60%)',
  },
  {
    id: 'publish',
    icon: FileText,
    title: 'Write & Publish Content',
    subtitle: 'CMS to multi-channel distribution',
    duration: 10000,
    color: 'hsl(262 83% 58%)',
  },
  {
    id: 'course',
    icon: GraduationCap,
    title: 'Create Learning Experience',
    subtitle: 'LMS course with assessments',
    duration: 11000,
    color: 'hsl(38 92% 50%)',
  },
  {
    id: 'automation',
    icon: Zap,
    title: 'Automate Workflows',
    subtitle: 'Triggers, actions, integrations',
    duration: 9000,
    color: 'hsl(142 76% 45%)',
  },
];

export const DemoModal = ({ open, onOpenChange }: DemoModalProps) => {
  const [activeScenario, setActiveScenario] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [completedScenarios, setCompletedScenarios] = useState<number[]>([]);

  const currentScenario = scenarios[activeScenario];

  // Progress and auto-advance
  useEffect(() => {
    if (!open || !isPlaying) return;

    const duration = currentScenario.duration;
    const interval = 50;
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          // Mark as completed and advance
          setCompletedScenarios(prev => 
            prev.includes(activeScenario) ? prev : [...prev, activeScenario]
          );
          
          // Auto-advance to next scenario
          if (activeScenario < scenarios.length - 1) {
            setActiveScenario(prev => prev + 1);
            return 0;
          } else {
            setIsPlaying(false);
            return 100;
          }
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [open, isPlaying, activeScenario, currentScenario.duration]);

  // Reset progress when scenario changes
  useEffect(() => {
    setProgress(0);
  }, [activeScenario]);

  const handleScenarioSelect = (index: number) => {
    setActiveScenario(index);
    setProgress(0);
    setIsPlaying(true);
  };

  const handleRestart = () => {
    setActiveScenario(0);
    setProgress(0);
    setCompletedScenarios([]);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] h-[85vh] p-0 gap-0 overflow-hidden bg-background border-border">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-72 border-r border-border bg-muted/30 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-2 mb-1">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-green-500"
                />
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Live Demo
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground">How Zenith Works</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Watch each studio in action
              </p>
            </div>

            {/* Scenario List */}
            <div className="flex-1 p-3 space-y-2 overflow-auto">
              {scenarios.map((scenario, index) => {
                const isActive = activeScenario === index;
                const isCompleted = completedScenarios.includes(index);
                const ScenarioIcon = scenario.icon;

                return (
                  <motion.button
                    key={scenario.id}
                    onClick={() => handleScenarioSelect(index)}
                    className={`w-full p-3 rounded-xl text-left transition-all relative overflow-hidden ${
                      isActive
                        ? 'bg-primary/10 border-2 border-primary'
                        : 'bg-card border border-border hover:border-muted-foreground'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Progress bar for active */}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 h-1 bg-primary/50 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    )}

                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isActive ? 'bg-primary text-primary-foreground' : 
                          isCompleted ? 'bg-green-500/20 text-green-500' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {isCompleted && !isActive ? (
                          <CheckCircle2 size={18} />
                        ) : (
                          <ScenarioIcon size={18} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold truncate ${
                            isActive ? 'text-primary' : 'text-foreground'
                          }`}>
                            {scenario.title}
                          </span>
                          {isActive && (
                            <motion.div
                              animate={{ x: [0, 3, 0] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              <ChevronRight size={14} className="text-primary" />
                            </motion.div>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {scenario.subtitle}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Controls */}
            <div className="p-4 border-t border-border bg-card/50">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={isPlaying ? 'outline' : 'default'}
                  onClick={togglePlayPause}
                  className="flex-1"
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  <span className="ml-2">{isPlaying ? 'Pause' : 'Play'}</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRestart}
                >
                  <RotateCcw size={14} />
                </Button>
              </div>
              
              {/* Overall progress */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{completedScenarios.length}/{scenarios.length} completed</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    style={{ 
                      width: `${((completedScenarios.length + (progress / 100)) / scenarios.length) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Preview Area */}
          <div className="flex-1 flex flex-col bg-background relative">
            {/* Close button */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-muted/80 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={16} />
            </button>

            {/* Scenario Title Bar */}
            <div className="px-6 py-4 border-b border-border bg-muted/20">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${currentScenario.color}20`, color: currentScenario.color }}
                >
                  <currentScenario.icon size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground">{currentScenario.title}</h4>
                  <p className="text-sm text-muted-foreground">{currentScenario.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Animated Preview */}
            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeScenario}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  {activeScenario === 0 && <ScenarioWebsiteBuilder progress={progress} isPlaying={isPlaying} />}
                  {activeScenario === 1 && <ScenarioContentPublish progress={progress} isPlaying={isPlaying} />}
                  {activeScenario === 2 && <ScenarioLMSCourse progress={progress} isPlaying={isPlaying} />}
                  {activeScenario === 3 && <ScenarioAutomation progress={progress} isPlaying={isPlaying} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
