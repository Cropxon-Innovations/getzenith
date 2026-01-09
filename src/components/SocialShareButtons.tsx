import { motion } from 'framer-motion';
import { Twitter, Linkedin, Facebook, Link2, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SocialShareButtonsProps {
  url?: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'compact' | 'floating';
  className?: string;
}

export const SocialShareButtons = ({ 
  url = typeof window !== 'undefined' ? window.location.href : 'https://zenith.studio',
  title = 'Zenith Studio by Cropxon - Digital Business Operating System',
  description = 'Run your digital business from one control plane. CMS, LMS, Website Builder, and Automation Workflow Studio.',
  variant = 'default',
  className = ''
}: SocialShareButtonsProps) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/30',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] hover:border-[#0A66C2]/30',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:bg-[#1877F2]/10 hover:text-[#1877F2] hover:border-[#1877F2]/30',
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: 'hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]/30',
    },
    {
      name: 'Email',
      icon: Mail,
      href: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
      color: 'hover:bg-primary/10 hover:text-primary hover:border-primary/30',
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {shareLinks.slice(0, 3).map((link) => (
          <motion.a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${link.name}`}
            className={`w-8 h-8 rounded-md border border-border flex items-center justify-center text-muted-foreground transition-all ${link.color}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <link.icon size={14} />
          </motion.a>
        ))}
        <motion.button
          onClick={copyToClipboard}
          aria-label="Copy link"
          className="w-8 h-8 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link2 size={14} />
        </motion.button>
      </div>
    );
  }

  if (variant === 'floating') {
    return (
      <motion.div 
        className={`fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2 ${className}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
      >
        {shareLinks.map((link, index) => (
          <motion.a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${link.name}`}
            className={`w-10 h-10 rounded-full border border-border bg-card/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground shadow-sm transition-all ${link.color}`}
            whileHover={{ scale: 1.15, x: -4 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + index * 0.1 }}
          >
            <link.icon size={16} />
          </motion.a>
        ))}
        <motion.button
          onClick={copyToClipboard}
          aria-label="Copy link"
          className="w-10 h-10 rounded-full border border-border bg-card/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground shadow-sm hover:bg-secondary hover:text-foreground transition-all"
          whileHover={{ scale: 1.15, x: -4 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 + shareLinks.length * 0.1 }}
        >
          <Link2 size={16} />
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <span className="text-sm text-muted-foreground font-medium">Share:</span>
      {shareLinks.map((link) => (
        <motion.a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${link.name}`}
          className={`w-10 h-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground transition-all ${link.color}`}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <link.icon size={18} />
        </motion.a>
      ))}
      <motion.button
        onClick={copyToClipboard}
        aria-label="Copy link"
        className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link2 size={18} />
      </motion.button>
    </div>
  );
};
