import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  GraduationCap, BookOpen, Video, FileQuestion, 
  CheckCircle2, Plus, Users, Award, PlayCircle,
  Clock, BarChart3, Star
} from 'lucide-react';

interface ScenarioProps {
  progress: number;
  isPlaying: boolean;
}

const modules = [
  { id: 1, title: 'Introduction', lessons: 3, duration: '15 min' },
  { id: 2, title: 'Core Concepts', lessons: 5, duration: '45 min' },
  { id: 3, title: 'Advanced Topics', lessons: 4, duration: '30 min' },
];

const lessonTypes = [
  { icon: Video, label: 'Video Lesson', color: '#3B82F6' },
  { icon: BookOpen, label: 'Reading', color: '#8B5CF6' },
  { icon: FileQuestion, label: 'Quiz', color: '#10B981' },
];

export const ScenarioLMSCourse = ({ progress, isPlaying }: ScenarioProps) => {
  const [addedModules, setAddedModules] = useState<number[]>([]);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [coursePublished, setCoursePublished] = useState(false);
  const [enrollments, setEnrollments] = useState(0);

  useEffect(() => {
    if (progress < 15) {
      setAddedModules([]);
    } else if (progress < 30) {
      setAddedModules([1]);
    } else if (progress < 45) {
      setAddedModules([1, 2]);
    } else if (progress < 55) {
      setAddedModules([1, 2, 3]);
    } else if (progress < 65) {
      setCurrentLesson(1);
    } else if (progress < 75) {
      setShowQuiz(true);
    } else if (progress < 85) {
      setQuizAnswered(true);
    } else if (progress < 95) {
      setCoursePublished(true);
    } else {
      setEnrollments(24);
    }
  }, [progress]);

  return (
    <div className="h-full flex">
      {/* Left: Course Structure */}
      <div className="w-72 border-r border-border bg-muted/20 p-4 overflow-auto">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap size={18} className="text-primary" />
          <span className="text-sm font-semibold">Course Builder</span>
        </div>

        {/* Course info */}
        <div className="p-3 rounded-lg border border-border bg-card mb-4">
          <h3 className="text-sm font-bold text-foreground mb-1">
            Mastering Zenith Studio
          </h3>
          <p className="text-xs text-muted-foreground">
            Complete guide for beginners
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock size={10} />
              90 min
            </span>
            <span className="flex items-center gap-1">
              <BookOpen size={10} />
              12 lessons
            </span>
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-2">
          {modules.map((module) => {
            const isAdded = addedModules.includes(module.id);
            const isAnimating = !isAdded && addedModules.length + 1 === module.id;

            return (
              <motion.div
                key={module.id}
                initial={isAdded ? { opacity: 0, x: -20 } : {}}
                animate={isAdded ? { opacity: 1, x: 0 } : isAnimating ? {
                  borderColor: ['hsl(var(--border))', 'hsl(var(--primary))', 'hsl(var(--border))'],
                } : {}}
                transition={isAnimating ? { duration: 1, repeat: Infinity } : { duration: 0.3 }}
                className={`p-3 rounded-lg border ${
                  isAdded ? 'border-primary/50 bg-primary/5' : 'border-border bg-card/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${isAdded ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {module.title}
                  </span>
                  {isAdded && <CheckCircle2 size={14} className="text-primary" />}
                </div>
                {isAdded && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{module.lessons} lessons</span>
                    <span>•</span>
                    <span>{module.duration}</span>
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* Add module button */}
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-3 rounded-lg border-2 border-dashed border-border flex items-center justify-center gap-2 text-muted-foreground"
          >
            <Plus size={14} />
            <span className="text-xs">Add Module</span>
          </motion.div>
        </div>
      </div>

      {/* Center: Lesson Preview */}
      <div className="flex-1 p-6 overflow-hidden">
        <AnimatePresence mode="wait">
          {!showQuiz ? (
            <motion.div
              key="lesson"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              {/* Video preview */}
              <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-xl border border-border relative overflow-hidden mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={currentLesson > 0 ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center"
                  >
                    <PlayCircle size={32} className="text-primary" />
                  </motion.div>
                </div>
                
                {/* Progress bar */}
                {currentLesson > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '45%' }}
                      transition={{ duration: 2 }}
                      className="h-full bg-primary"
                    />
                  </div>
                )}

                {/* Lesson type indicator */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm">
                  <Video size={12} className="text-primary" />
                  <span className="text-xs font-medium">Video Lesson</span>
                </div>
              </div>

              {/* Lesson info */}
              <h3 className="text-lg font-bold text-foreground mb-2">
                Getting Started with the Platform
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Learn the basics of navigating and using Zenith Studio effectively.
              </p>

              {/* Lesson types */}
              <div className="flex gap-2">
                {lessonTypes.map((type, i) => (
                  <motion.div
                    key={type.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border"
                  >
                    <type.icon size={14} style={{ color: type.color }} />
                    <span className="text-xs">{type.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col"
            >
              <div className="flex items-center gap-2 mb-4">
                <FileQuestion size={18} className="text-primary" />
                <span className="text-sm font-semibold">Knowledge Check</span>
              </div>

              <div className="flex-1 p-6 rounded-xl border border-border bg-card">
                <h4 className="text-lg font-semibold text-foreground mb-4">
                  Which feature allows you to publish content to multiple channels?
                </h4>

                <div className="space-y-2">
                  {['Single Editor', 'Distribution Hub', 'Content Library', 'Media Manager'].map((option, i) => (
                    <motion.div
                      key={option}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        quizAnswered && i === 1
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-border hover:border-muted-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          quizAnswered && i === 1 ? 'border-green-500 bg-green-500' : 'border-border'
                        }`}>
                          {quizAnswered && i === 1 && <CheckCircle2 size={12} className="text-white" />}
                        </div>
                        <span className="text-sm">{option}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {quizAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center gap-2"
                  >
                    <CheckCircle2 size={16} className="text-green-500" />
                    <span className="text-sm text-green-600">Correct! Great job!</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right: Course Stats */}
      <div className="w-56 border-l border-border bg-muted/20 p-4">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Course Status
        </div>

        {/* Publish status */}
        <motion.div
          animate={coursePublished ? {} : { opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: coursePublished ? 0 : Infinity }}
          className={`p-3 rounded-lg border mb-4 ${
            coursePublished ? 'border-green-500/50 bg-green-500/10' : 'border-border bg-card'
          }`}
        >
          <div className="flex items-center gap-2">
            {coursePublished ? (
              <CheckCircle2 size={16} className="text-green-500" />
            ) : (
              <Clock size={16} className="text-muted-foreground" />
            )}
            <span className={`text-sm font-medium ${coursePublished ? 'text-green-600' : 'text-foreground'}`}>
              {coursePublished ? 'Published' : 'Draft'}
            </span>
          </div>
        </motion.div>

        {/* Stats */}
        <AnimatePresence>
          {coursePublished && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="p-3 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-2 mb-1">
                  <Users size={14} className="text-primary" />
                  <span className="text-xs text-muted-foreground">Enrollments</span>
                </div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-2xl font-bold text-foreground"
                >
                  {enrollments}
                </motion.span>
              </div>

              <div className="p-3 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 size={14} className="text-primary" />
                  <span className="text-xs text-muted-foreground">Completion</span>
                </div>
                <span className="text-2xl font-bold text-foreground">78%</span>
              </div>

              <div className="p-3 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-2 mb-1">
                  <Star size={14} className="text-yellow-500" />
                  <span className="text-xs text-muted-foreground">Rating</span>
                </div>
                <span className="text-2xl font-bold text-foreground">4.8</span>
              </div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-center"
              >
                <Award size={24} className="text-primary mx-auto mb-1" />
                <span className="text-xs font-medium text-primary">Course Live!</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
