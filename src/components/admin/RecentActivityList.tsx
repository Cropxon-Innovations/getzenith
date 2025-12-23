import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

export interface ActivityItem {
  id: string;
  action: string;
  description?: string;
  time: string | Date;
  icon: LucideIcon;
  color: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

interface RecentActivityListProps {
  activities: ActivityItem[];
  onViewAll?: () => void;
  maxItems?: number;
}

export const RecentActivityList = ({
  activities,
  onViewAll,
  maxItems = 5,
}: RecentActivityListProps) => {
  const displayedActivities = activities.slice(0, maxItems);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Recent Activity</CardTitle>
          {onViewAll && (
            <Button variant="ghost" size="sm" className="text-xs" onClick={onViewAll}>
              View All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayedActivities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent activity
            </p>
          ) : (
            displayedActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <activity.icon size={14} className={activity.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{activity.action}</p>
                  {activity.description && (
                    <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-muted-foreground">
                      {typeof activity.time === 'string'
                        ? activity.time
                        : formatDistanceToNow(activity.time, { addSuffix: true })}
                    </p>
                    {activity.user && (
                      <span className="text-xs text-muted-foreground">
                        by {activity.user.name}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
