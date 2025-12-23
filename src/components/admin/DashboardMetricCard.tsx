import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DashboardMetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  color: string;
  bgColor: string;
  delay?: number;
}

export const DashboardMetricCard = ({
  icon: Icon,
  label,
  value,
  change,
  changeType = 'neutral',
  color,
  bgColor,
  delay = 0,
}: DashboardMetricCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="relative overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center`}>
              <Icon size={20} className={color} />
            </div>
            {change && (
              <div className={`flex items-center gap-1 text-xs font-medium ${
                changeType === 'positive' ? 'text-green-500' :
                changeType === 'negative' ? 'text-red-500' :
                'text-muted-foreground'
              }`}>
                {changeType === 'positive' && <TrendingUp size={12} />}
                {changeType === 'negative' && <TrendingDown size={12} />}
                {change}
              </div>
            )}
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
