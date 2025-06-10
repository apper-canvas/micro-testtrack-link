import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const ContextMenu = ({ isOpen, position, onClose, items = [] }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="fixed z-50 bg-white rounded-lg shadow-lg border border-surface-200 py-2 min-w-48"
        style={{
          left: position.x,
          top: position.y,
        }}
      >
        {items.map((item, index) => (
          <div key={index}>
            {item.type === 'divider' ? (
              <div className="h-px bg-surface-200 my-1" />
            ) : (
              <button
                onClick={() => {
                  item.onClick();
                  onClose();
                }}
                disabled={item.disabled}
                className={`
                  w-full px-4 py-2 text-left text-sm flex items-center gap-3
                  hover:bg-surface-50 transition-colors
                  ${item.disabled ? 'text-surface-400 cursor-not-allowed' : 'text-surface-700'}
                  ${item.destructive ? 'text-red-600 hover:bg-red-50' : ''}
                `}
              >
                {item.icon && (
                  <ApperIcon
                    name={item.icon}
                    size={16}
                    className={item.destructive ? 'text-red-600' : 'text-surface-500'}
                  />
                )}
                <span>{item.label}</span>
                {item.shortcut && (
                  <span className="ml-auto text-xs text-surface-400">
                    {item.shortcut}
                  </span>
                )}
              </button>
            )}
          </div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default ContextMenu;