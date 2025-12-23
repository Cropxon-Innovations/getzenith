import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Globe, GraduationCap, Zap, LayoutDashboard } from 'lucide-react';
import type { OnboardingState } from '@/pages/Onboarding';

interface OnboardingPreviewProps {
  state: OnboardingState;
  currentStep: string;
}

export const OnboardingPreview = ({ state, currentStep }: OnboardingPreviewProps) => {
  const primaryColor = state.primaryColor || '#3B82F6';

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-border">
        <h3 className="font-semibold text-foreground">Live Preview</h3>
        <p className="text-sm text-muted-foreground mt-1">
          See your platform take shape
        </p>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {/* Mock Dashboard Preview */}
            <div className="rounded-xl border border-border bg-background overflow-hidden h-full">
              {/* Mock Header */}
              <div 
                className="h-12 border-b border-border flex items-center px-4 gap-3"
                style={{ backgroundColor: `${primaryColor}10` }}
              >
                <div 
                  className="w-6 h-6 rounded-md"
                  style={{ backgroundColor: primaryColor }}
                />
                <span className="font-medium text-sm">
                  {state.brandName || 'Your Business'}
                </span>
              </div>

              <div className="flex h-[calc(100%-3rem)]">
                {/* Mock Sidebar */}
                <div className="w-14 border-r border-border p-2 space-y-2">
                  {[LayoutDashboard, FileText, Globe, GraduationCap, Zap].map((Icon, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center"
                      style={i === 0 ? { backgroundColor: `${primaryColor}20` } : {}}
                    >
                      <Icon 
                        size={18} 
                        style={i === 0 ? { color: primaryColor } : {}} 
                        className={i !== 0 ? 'text-muted-foreground' : ''}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Mock Content Area */}
                <div className="flex-1 p-4">
                  {state.businessType && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      {/* Welcome Card */}
                      <div 
                        className="p-4 rounded-lg border"
                        style={{ borderColor: `${primaryColor}30`, backgroundColor: `${primaryColor}05` }}
                      >
                        <div className="text-xs font-medium" style={{ color: primaryColor }}>
                          Welcome to
                        </div>
                        <div className="font-semibold text-foreground">
                          {state.brandName || 'Your Platform'}
                        </div>
                      </div>

                      {/* Mock Content Cards */}
                      {state.businessGoals.slice(0, 2).map((goal, i) => (
                        <motion.div
                          key={goal}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                          className="p-3 rounded-lg bg-muted/50 border border-border"
                        >
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: primaryColor }}
                            />
                            <span className="text-xs text-muted-foreground capitalize">
                              {goal.replace(/-/g, ' ')}
                            </span>
                          </div>
                        </motion.div>
                      ))}

                      {/* Stats Mock */}
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        {['Content', 'Users', 'Views'].map((label, i) => (
                          <motion.div
                            key={label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + i * 0.1 }}
                            className="p-3 rounded-lg bg-card border border-border text-center"
                          >
                            <div className="text-lg font-bold" style={{ color: primaryColor }}>
                              0
                            </div>
                            <div className="text-[10px] text-muted-foreground">{label}</div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {!state.businessType && (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                      Select a business type to see preview
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
