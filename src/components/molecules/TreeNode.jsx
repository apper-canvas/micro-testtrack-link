import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ContextMenu from '@/components/molecules/ContextMenu';

const TreeNode = ({
  testCase,
  level = 0,
  isDragging = false,
  onExecuteTest,
  onDragStart,
  onDragEnd,
  onContextMenu,
  selectedNodeId,
  onSelect
}) => {
  const [contextMenu, setContextMenu] = useState({ isOpen: false, position: { x: 0, y: 0 } });
  const nodeRef = useRef(null);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      type: 'testCase',
      id: testCase.id,
      data: testCase
    }));
    e.dataTransfer.effectAllowed = 'move';
    onDragStart?.(testCase.id);
  };

  const handleDragEnd = () => {
    onDragEnd?.();
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    const rect = nodeRef.current.getBoundingClientRect();
    setContextMenu({
      isOpen: true,
      position: { x: e.clientX, y: e.clientY }
    });
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect?.(testCase.id);
  };

  const contextMenuItems = [
    {
      label: 'Execute Test',
      icon: 'Play',
      onClick: () => onExecuteTest(testCase)
    },
    {
      label: 'Edit Test Case',
      icon: 'Edit',
      onClick: () => console.log('Edit test case:', testCase.id)
    },
    { type: 'divider' },
    {
      label: 'Copy',
      icon: 'Copy',
      onClick: () => console.log('Copy test case:', testCase.id),
      shortcut: 'Ctrl+C'
    },
    {
      label: 'Delete',
      icon: 'Trash2',
      onClick: () => console.log('Delete test case:', testCase.id),
      destructive: true
    }
  ];

  return (
    <>
      <motion.div
        ref={nodeRef}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: level * 0.05 }}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onContextMenu={handleContextMenu}
        onClick={handleClick}
        className={`
          group relative flex items-center gap-3 p-2 rounded-md cursor-pointer
          transition-all duration-200
          ${isDragging ? 'tree-node-dragging' : ''}
          ${selectedNodeId === testCase.id ? 'bg-tree-selected border border-blue-200' : 'hover:bg-tree-hover'}
          ${level > 0 ? 'ml-6' : ''}
        `}
        style={{ paddingLeft: `${level * 24 + 8}px` }}
      >
        {/* Tree connector lines */}
        {level > 0 && (
          <div className="absolute left-0 top-0 bottom-0 w-px bg-surface-200" 
               style={{ left: `${(level - 1) * 24 + 12}px` }} />
        )}
        
        {/* Test case icon */}
        <div className="flex-shrink-0">
          <ApperIcon
            name="FileCheck"
            size={16}
            className="text-surface-500"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-medium text-surface-900 truncate">
              {testCase.title}
            </h4>
            <Badge type="status" value={testCase.lastRunStatus || 'not_run'} />
          </div>
          <p className="text-xs text-surface-600 truncate">
            {testCase.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="ghost"
            icon={ApperIcon}
            iconName="Play"
            iconSize={14}
            onClick={(e) => {
              e.stopPropagation();
              onExecuteTest(testCase);
            }}
            className="h-7 w-7 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
          />
          <Button
            size="sm"
            variant="ghost"
            icon={ApperIcon}
            iconName="MoreVertical"
            iconSize={14}
            onClick={(e) => {
              e.stopPropagation();
              handleContextMenu(e);
            }}
            className="h-7 w-7 p-0 text-surface-500 hover:text-surface-700 hover:bg-surface-100"
          />
        </div>

        {/* Drag indicator */}
        <div className="tree-drop-indicator" />
      </motion.div>

      <ContextMenu
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        onClose={() => setContextMenu({ ...contextMenu, isOpen: false })}
        items={contextMenuItems}
      />
    </>
  );
};

export default TreeNode;