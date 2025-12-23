import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  FileText, Send, Globe, Mail, MessageSquare, 
  CheckCircle2, Clock, Eye, Sparkles, Hash,
  Image, Link2, Bold, Italic
} from 'lucide-react';

interface ScenarioProps {
  progress: number;
  isPlaying: boolean;
}

const channels = [
  { id: 'website', icon: Globe, label: 'Website', color: '#3B82F6' },
  { id: 'email', icon: Mail, label: 'Email', color: '#8B5CF6' },
  { id: 'social', icon: MessageSquare, label: 'Social', color: '#10B981' },
];

export const ScenarioContentPublish = ({ progress, isPlaying }: ScenarioProps) => {
  const [typedText, setTypedText] = useState('');
  const [showImage, setShowImage] = useState(false);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedChannels, setPublishedChannels] = useState<string[]>([]);

  const fullText = "Introducing our latest features for seamless content creation and distribution across all your channels.";

  useEffect(() => {
    if (progress < 30) {
      // Typing phase
      const charCount = Math.floor((progress / 30) * fullText.length);
      setTypedText(fullText.slice(0, charCount));
    } else if (progress < 40) {
      setTypedText(fullText);
      setShowImage(true);
    } else if (progress < 55) {
      setSelectedChannels(['website']);
    } else if (progress < 65) {
      setSelectedChannels(['website', 'email']);
    } else if (progress < 75) {
      setSelectedChannels(['website', 'email', 'social']);
    } else if (progress < 85) {
      setIsPublishing(true);
    } else {
      setIsPublishing(false);
      setPublishedChannels(['website', 'email', 'social']);
    }
  }, [progress]);

  return (
    <div className="h-full flex">
      {/* Left: Toolbar */}
      <div className="w-14 border-r border-border bg-muted/20 flex flex-col items-center py-4 gap-2">
        {[Bold, Italic, Link2, Image, Hash].map((Icon, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.1 }}
            className="w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center cursor-pointer hover:border-primary/50"
          >
            <Icon size={14} className="text-muted-foreground" />
          </motion.div>
        ))}
      </div>

      {/* Center: Editor */}
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="text-primary" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Blog Post</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              New Product Announcement
            </h2>
          </motion.div>

          {/* Content */}
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-border bg-card min-h-[100px]">
              <p className="text-sm text-foreground leading-relaxed">
                {typedText}
                {progress < 30 && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-0.5 h-4 bg-primary ml-0.5 align-middle"
                  />
                )}
              </p>
            </div>

            {/* Image block */}
            <AnimatePresence>
              {showImage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="rounded-lg border border-border bg-muted/30 overflow-hidden"
                >
                  <div className="h-40 flex items-center justify-center relative">
                    <div className="text-center">
                      <Image size={32} className="text-muted-foreground mx-auto mb-2" />
                      <span className="text-xs text-muted-foreground">product-hero.jpg</span>
                    </div>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1 }}
                      className="absolute bottom-0 left-0 h-1 bg-green-500/50"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* AI suggestion */}
            <AnimatePresence>
              {progress > 35 && progress < 75 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20"
                >
                  <Sparkles size={14} className="text-primary" />
                  <span className="text-xs text-foreground">
                    AI: Consider adding a call-to-action button for better engagement
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right: Distribution */}
      <div className="w-64 border-l border-border bg-muted/20 p-4">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Distribution
        </div>

        {/* Channel selection */}
        <div className="space-y-2 mb-6">
          {channels.map((channel) => {
            const isSelected = selectedChannels.includes(channel.id);
            const isPublished = publishedChannels.includes(channel.id);

            return (
              <motion.div
                key={channel.id}
                animate={isSelected && !isPublished ? {
                  borderColor: [channel.color, `${channel.color}80`, channel.color],
                } : {}}
                transition={{ duration: 1, repeat: isSelected && !isPublished ? Infinity : 0 }}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  isPublished 
                    ? 'border-green-500/50 bg-green-500/10' 
                    : isSelected 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border bg-card'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ 
                    backgroundColor: isPublished ? '#10B98120' : `${channel.color}20`,
                    color: isPublished ? '#10B981' : channel.color
                  }}
                >
                  {isPublished ? <CheckCircle2 size={16} /> : <channel.icon size={16} />}
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-foreground">{channel.label}</span>
                  <span className="text-xs text-muted-foreground block">
                    {isPublished ? 'Published' : isSelected ? 'Ready' : 'Select'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Schedule info */}
        <div className="p-3 rounded-lg border border-border bg-card mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={14} className="text-muted-foreground" />
            <span className="text-xs font-medium">Schedule</span>
          </div>
          <span className="text-xs text-muted-foreground">Publish immediately</span>
        </div>

        {/* Publish button */}
        <motion.div
          animate={isPublishing ? {
            scale: [1, 1.02, 1],
          } : publishedChannels.length > 0 ? {} : {}}
          transition={{ duration: 0.5, repeat: isPublishing ? Infinity : 0 }}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg ${
            publishedChannels.length > 0
              ? 'bg-green-500 text-white'
              : isPublishing
                ? 'bg-primary/80 text-primary-foreground'
                : selectedChannels.length > 0
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
          }`}
        >
          {isPublishing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
              <span className="text-sm font-medium">Publishing...</span>
            </>
          ) : publishedChannels.length > 0 ? (
            <>
              <CheckCircle2 size={16} />
              <span className="text-sm font-medium">Published!</span>
            </>
          ) : (
            <>
              <Send size={16} />
              <span className="text-sm font-medium">Publish</span>
            </>
          )}
        </motion.div>

        {/* Stats after publish */}
        <AnimatePresence>
          {publishedChannels.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-lg bg-card border border-border"
            >
              <div className="flex items-center gap-2 mb-2">
                <Eye size={14} className="text-primary" />
                <span className="text-xs font-medium">Live Preview</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {publishedChannels.map((ch, i) => (
                  <motion.div
                    key={ch}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-2 rounded bg-muted/50"
                  >
                    <span className="text-lg font-bold text-primary">✓</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
