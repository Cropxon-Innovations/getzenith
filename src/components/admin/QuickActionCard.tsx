import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface QuickActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  color: string;
  bgColor: string;
  badge?: string;
  disabled?: boolean;
}

export const QuickActionCard = ({
  icon: Icon,
  title,
  description,
  href,
  color,
  bgColor,
  badge,
  disabled,
}: QuickActionCardProps) => {
  const content = (
    <Card
      className={`relative overflow-hidden transition-all h-full ${
        disabled
          ? 'opacity-60 cursor-not-allowed'
          : 'hover:shadow-lg hover:border-primary/50 cursor-pointer'
      }`}
    >
      {badge && (
        <span className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
          {badge}
        </span>
      )}
      <CardContent className="p-4">
        <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center mb-3`}>
          <Icon size={20} className={color} />
        </div>
        <h4 className="font-semibold text-foreground text-sm">{title}</h4>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );

  if (disabled) {
    return <motion.div whileHover={{ scale: 1 }}>{content}</motion.div>;
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Link to={href}>{content}</Link>
    </motion.div>
  );
};
