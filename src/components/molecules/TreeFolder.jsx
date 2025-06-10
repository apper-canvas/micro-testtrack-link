import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ContextMenu from '@/components/molecules/ContextMenu';

const TreeFolder = ({
  folder,
  level = 0,
  isExpanded = false,
  isDragOver = false,
  isDragging = false,
  testCasesCount = 0,
  passedCount = 0,
  failedCount = 0,
  children,
  onToggleExpanded,
  onRename,
  onDelete,
  onAddTestCase,
  onRunAllTests,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  selectedNodeId,
  onSelect
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(folder.name);
  const [contextMenu, setContextMenu] = useState({ isOpen: false, position: { x: 0, y: 0 } });
  const folderRef = useRef(null);

  const handleToggle = (e) => {
    e.stopPropagation();
    onToggleExpanded(folder.id);
  };

  const handleRename = () => {
    if (newName.trim() && newName !== folder.name) {
      onRename(folder.id, newName.trim());
    }
    setIsRenaming(false);
    setNewName(folder.name);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setIsRenaming(false);
      setNewName(folder.name);
    }
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      type: 'folder',
      id: folder.id,
      data: folder
    }));
    e.dataTransfer.effectAllowed = 'move';
    onDragStart?.(folder.id);
  };

  const handleDragEnd = () => {
    onDragEnd?.();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    onDragOver?.(folder.id);
  };

  const handleDragLeave = () => {
    onDragLeave?.(folder.id);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      onDrop?.(data, folder.id);
    } catch (error) {
      console.error('Invalid drag data:', error);
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({
      isOpen: true,
      position: { x: e.clientX, y: e.clientY }
    });
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect?.(folder.id);
  };

  const contextMenuItems = [
    {
      label: 'Run All Tests',
      icon: 'Play',
      onClick: () => onRunAllTests(folder.id),
      disabled: testCasesCount === 0
    },
    {
      label: 'Add Test Case',
      icon: 'Plus',
      onClick: () => onAddTestCase(folder.id)
    },
    { type: 'divider' },
    {
      label: 'Rename',
      icon: 'Edit',
      onClick: () => setIsRenaming(true),
      shortcut: 'F2'
    },
    {
      label: 'New Folder',
      icon: 'FolderPlus',
      onClick: () => console.log('Create subfolder in:', folder.id)
    },
    { type: 'divider' },
    {
      label: 'Delete',
      icon: 'Trash2',
      onClick: () => onDelete(folder.id),
      destructive: true
    }
  ];

  return (
    <>
      <motion.div
        ref={folderRef}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: level * 0.05 }}
        draggable={!isRenaming}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onContextMenu={handleContextMenu}
        onClick={handleClick}
        className={`
          group relative flex items-center gap-2 p-2 rounded-md cursor-pointer
          transition-all duration-200
          ${isDragging ? 'tree-node-dragging' : ''}
          ${isDragOver ? 'tree-folder-drop-target' : ''}
          ${selectedNodeId === folder.id ? 'bg-tree-selected border border-blue-200' : 'hover:bg-tree-hover'}
          ${level > 0 ? 'ml-6' : ''}
        `}
        style={{ paddingLeft: `${level * 24 + 8}px` }}
      >
        {/* Tree connector lines */}
        {level > 0 && (
          <div className="absolute left-0 top-0 bottom-0 w-px bg-surface-200" 
               style={{ left: `${(level - 1) * 24 + 12}px` }} />
        )}

        {/* Expand/collapse toggle */}
        <Button
          size="sm"
          variant="ghost"
          onClick={handleToggle}
          className="h-6 w-6 p-0 hover:bg-surface-200"
        >
          <ApperIcon
            name={isExpanded ? "ChevronDown" : "ChevronRight"}
            size={14}
            className="text-surface-600"
          />
        </Button>

        {/* Folder icon */}
        <div className="flex-shrink-0">
          <ApperIcon
            name={isExpanded ? "FolderOpen" : "Folder"}
            size={16}
            className="text-blue-600"
          />
        </div>

        {/* Folder name */}
        <div className="flex-1 min-w-0">
          {isRenaming ? (
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyDown}
              className="h-6 text-sm py-0 px-1"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-surface-900 truncate">
                {folder.name}
              </span>
              {testCasesCount > 0 && (
                <div className="flex items-center gap-1">
                  <Badge 
                    type="custom" 
                    className="bg-surface-100 text-surface-600 text-xs px-1.5 py-0.5"
                  >
                    {testCasesCount}
                  </Badge>
                  {passedCount > 0 && (
                    <Badge 
                      type="custom" 
                      className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5"
                    >
                      ✓{passedCount}
                    </Badge>
                  )}
                  {failedCount > 0 && (
                    <Badge 
                      type="custom" 
                      className="bg-red-100 text-red-700 text-xs px-1.5 py-0.5"
                    >
                      ✗{failedCount}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        {!isRenaming && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              icon={ApperIcon}
              iconName="Play"
              iconSize={14}
              onClick={(e) => {
                e.stopPropagation();
                onRunAllTests(folder.id);
              }}
              disabled={testCasesCount === 0}
              className="h-7 w-7 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
            />
            <Button
              size="sm"
              variant="ghost"
              icon={ApperIcon}
              iconName="Plus"
              iconSize={14}
              onClick={(e) => {
                e.stopPropagation();
                onAddTestCase(folder.id);
              }}
              className="h-7 w-7 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
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
        )}

        {/* Drag indicator */}
        <div className="tree-drop-indicator" />
      </motion.div>

      {/* Children */}
      <AnimatePresence>
        {isExpanded && children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      <ContextMenu
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        onClose={() => setContextMenu({ ...contextMenu, isOpen: false })}
        items={contextMenuItems}
      />
    </>
  );
};

export default TreeFolder;