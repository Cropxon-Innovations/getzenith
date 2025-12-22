import { motion } from 'framer-motion';
import { useCollaboration } from './CollaborationProvider';
import { cn } from '@/lib/utils';

interface CollaboratorAvatarsProps {
  maxVisible?: number;
  size?: 'sm' | 'md';
}

export const CollaboratorAvatars = ({ maxVisible = 3, size = 'sm' }: CollaboratorAvatarsProps) => {
  const { collaborators, currentUser, isCollaborationEnabled } = useCollaboration();

  if (!isCollaborationEnabled) return null;

  const allUsers = [
    { id: currentUser.id, name: currentUser.name, initials: currentUser.initials, color: currentUser.color },
    ...collaborators.map((c) => ({
      id: c.id,
      name: c.name,
      initials: c.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
      color: c.color,
    })),
  ];

  const visibleUsers = allUsers.slice(0, maxVisible);
  const hiddenCount = Math.max(0, allUsers.length - maxVisible);

  const sizeClasses = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-8 h-8 text-xs',
  };

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {visibleUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, scale: 0.8, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              'rounded-full flex items-center justify-center font-medium text-white ring-2 ring-background',
              sizeClasses[size]
            )}
            style={{ backgroundColor: user.color }}
            title={user.name}
          >
            {user.initials}
          </motion.div>
        ))}
        {hiddenCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              'rounded-full flex items-center justify-center font-medium bg-muted text-muted-foreground ring-2 ring-background',
              sizeClasses[size]
            )}
          >
            +{hiddenCount}
          </motion.div>
        )}
      </div>
      {collaborators.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="ml-2 flex items-center gap-1.5"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-muted-foreground">
            {collaborators.length} editing
          </span>
        </motion.div>
      )}
    </div>
  );
};
