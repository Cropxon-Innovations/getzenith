import { motion, AnimatePresence } from 'framer-motion';
import { useCollaboration } from './CollaborationProvider';

export const CursorOverlay = () => {
  const { collaborators, isCollaborationEnabled } = useCollaboration();

  if (!isCollaborationEnabled || collaborators.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {collaborators.map((cursor) => (
          <motion.div
            key={cursor.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: cursor.x,
              y: cursor.y,
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', damping: 30, stiffness: 500 }}
            className="absolute"
            style={{ left: cursor.x, top: cursor.y }}
          >
            {/* Cursor Arrow */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="drop-shadow-md"
            >
              <path
                d="M5.65 2.15L20.85 11.15C21.75 11.7 21.55 13 20.55 13.25L13.55 15.05L10.05 21.45C9.55 22.35 8.25 22.15 8.05 21.15L5.05 3.15C4.85 2.25 5.85 1.65 5.65 2.15Z"
                fill={cursor.color}
                stroke="white"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            
            {/* Name Tag */}
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute left-5 top-5 px-2 py-1 rounded-md text-xs font-medium text-white whitespace-nowrap shadow-lg"
              style={{ backgroundColor: cursor.color }}
            >
              {cursor.name}
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
