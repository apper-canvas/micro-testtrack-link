import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import TreeFolder from '@/components/molecules/TreeFolder';
import TreeNode from '@/components/molecules/TreeNode';
import EmptyState from '@/components/atoms/EmptyState';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { treeService } from '@/services';

const TreeView = ({ 
  testCases = [], 
  onExecuteTest, 
  onShowCreateForm,
  filteredTestCases = []
}) => {
  const [treeData, setTreeData] = useState({ folders: [], rootFolderIds: [], unassignedTestCaseIds: [] });
  const [loading, setLoading] = useState(true);
  const [dragState, setDragState] = useState({ dragging: null, dragOver: null });
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const treeRef = useRef(null);

  useEffect(() => {
    loadTreeData();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedNodeId) return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          navigateUp();
          break;
        case 'ArrowDown':
          e.preventDefault();
          navigateDown();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (e.ctrlKey) {
            collapseFolder();
          } else {
            navigateToParent();
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (e.ctrlKey) {
            expandFolder();
          } else {
            navigateToChild();
          }
          break;
        case 'Enter':
          e.preventDefault();
          handleEnterKey();
          break;
        case 'F2':
          e.preventDefault();
          handleRenameKey();
          break;
        case 'Delete':
          e.preventDefault();
          handleDeleteKey();
          break;
      }
    };

    if (treeRef.current) {
      treeRef.current.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (treeRef.current) {
        treeRef.current.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [selectedNodeId, treeData]);

  const loadTreeData = async () => {
    setLoading(true);
    try {
      const data = await treeService.getTreeStructure();
      setTreeData(data);
    } catch (error) {
      toast.error('Failed to load tree structure');
      console.error('Tree load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleExpanded = async (folderId) => {
    try {
      const expanded = await treeService.toggleFolderExpanded(folderId);
      setTreeData(prev => ({
        ...prev,
        expandedState: new Set(
          expanded 
            ? [...prev.expandedState, folderId]
            : [...prev.expandedState].filter(id => id !== folderId)
        )
      }));
    } catch (error) {
      toast.error('Failed to toggle folder');
    }
  };

  const handleRenameFolder = async (folderId, newName) => {
    try {
      const updatedFolder = await treeService.updateFolder(folderId, { name: newName });
      setTreeData(prev => ({
        ...prev,
        folders: prev.folders.map(f => f.id === folderId ? updatedFolder : f)
      }));
      toast.success('Folder renamed successfully');
    } catch (error) {
      toast.error('Failed to rename folder');
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (!window.confirm('Are you sure you want to delete this folder? Test cases will be moved to unassigned.')) {
      return;
    }

    try {
      await treeService.deleteFolder(folderId);
      await loadTreeData(); // Reload to reflect changes
      toast.success('Folder deleted successfully');
    } catch (error) {
      toast.error('Failed to delete folder');
    }
  };

  const handleRunAllTests = async (folderId) => {
    try {
      const result = await treeService.runAllTestsInFolder(folderId);
      toast.success(result.message);
      // Here you would integrate with the actual test execution system
    } catch (error) {
      toast.error('Failed to run tests');
    }
  };

  const handleAddTestCase = (folderId) => {
    // Store the target folder ID and show create form
    sessionStorage.setItem('targetFolderId', folderId);
    onShowCreateForm();
  };

  const handleDragStart = (itemId) => {
    setDragState(prev => ({ ...prev, dragging: itemId }));
  };

  const handleDragEnd = () => {
    setDragState({ dragging: null, dragOver: null });
  };

  const handleDragOver = (folderId) => {
    setDragState(prev => ({ ...prev, dragOver: folderId }));
  };

  const handleDragLeave = () => {
    setDragState(prev => ({ ...prev, dragOver: null }));
  };

  const handleDrop = async (dragData, targetFolderId) => {
    try {
      if (dragData.type === 'testCase') {
        await treeService.moveTestCaseToFolder(dragData.id, targetFolderId);
        toast.success('Test case moved successfully');
      } else if (dragData.type === 'folder') {
        await treeService.moveFolderToFolder(dragData.id, targetFolderId);
        toast.success('Folder moved successfully');
      }
      await loadTreeData();
    } catch (error) {
      toast.error(error.message || 'Failed to move item');
    }
    setDragState({ dragging: null, dragOver: null });
  };

  // Keyboard navigation helpers
  const navigateUp = () => {
    // Implementation for navigating to previous visible node
    console.log('Navigate up from:', selectedNodeId);
  };

  const navigateDown = () => {
    // Implementation for navigating to next visible node
    console.log('Navigate down from:', selectedNodeId);
  };

  const navigateToParent = () => {
    const folder = treeData.folders.find(f => f.childFolderIds.includes(selectedNodeId));
    if (folder) {
      setSelectedNodeId(folder.id);
    }
  };

  const navigateToChild = () => {
    const folder = treeData.folders.find(f => f.id === selectedNodeId);
    if (folder && folder.childFolderIds.length > 0) {
      setSelectedNodeId(folder.childFolderIds[0]);
    }
  };

  const expandFolder = async () => {
    if (selectedNodeId && treeData.folders.find(f => f.id === selectedNodeId)) {
      await treeService.setFolderExpanded(selectedNodeId, true);
      setTreeData(prev => ({
        ...prev,
        expandedState: new Set([...prev.expandedState, selectedNodeId])
      }));
    }
  };

  const collapseFolder = async () => {
    if (selectedNodeId && treeData.folders.find(f => f.id === selectedNodeId)) {
      await treeService.setFolderExpanded(selectedNodeId, false);
      setTreeData(prev => ({
        ...prev,
        expandedState: new Set([...prev.expandedState].filter(id => id !== selectedNodeId))
      }));
    }
  };

  const handleEnterKey = () => {
    const folder = treeData.folders.find(f => f.id === selectedNodeId);
    if (folder) {
      handleToggleExpanded(selectedNodeId);
    } else {
      // Find test case and execute
      const testCase = testCases.find(tc => tc.id === selectedNodeId);
      if (testCase) {
        onExecuteTest(testCase);
      }
    }
  };

  const handleRenameKey = () => {
    // This would trigger rename mode for the selected folder
    console.log('Rename:', selectedNodeId);
  };

  const handleDeleteKey = () => {
    const folder = treeData.folders.find(f => f.id === selectedNodeId);
    if (folder) {
      handleDeleteFolder(selectedNodeId);
    }
  };

  const getTestCasesInFolder = (folderId) => {
    const folder = treeData.folders.find(f => f.id === folderId);
    if (!folder) return [];
    
    return testCases.filter(tc => folder.testCaseIds.includes(tc.id));
  };

  const getTestCaseStats = (folderId) => {
    const testCasesInFolder = getTestCasesInFolder(folderId);
    const passed = testCasesInFolder.filter(tc => tc.lastRunStatus === 'passed').length;
    const failed = testCasesInFolder.filter(tc => tc.lastRunStatus === 'failed').length;
    
    return {
      total: testCasesInFolder.length,
      passed,
      failed
    };
  };

  const renderTreeFolder = (folder, level = 0) => {
    const isExpanded = treeData.expandedState.has(folder.id);
    const stats = getTestCaseStats(folder.id);
    const testCasesInFolder = getTestCasesInFolder(folder.id);
    
    return (
      <div key={folder.id}>
        <TreeFolder
          folder={folder}
          level={level}
          isExpanded={isExpanded}
          isDragOver={dragState.dragOver === folder.id}
          isDragging={dragState.dragging === folder.id}
          testCasesCount={stats.total}
          passedCount={stats.passed}
          failedCount={stats.failed}
          onToggleExpanded={handleToggleExpanded}
          onRename={handleRenameFolder}
          onDelete={handleDeleteFolder}
          onAddTestCase={handleAddTestCase}
          onRunAllTests={handleRunAllTests}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          selectedNodeId={selectedNodeId}
          onSelect={setSelectedNodeId}
        >
          {/* Render child folders */}
          {folder.childFolderIds.map(childId => {
            const childFolder = treeData.folders.find(f => f.id === childId);
            return childFolder ? renderTreeFolder(childFolder, level + 1) : null;
          })}
          
          {/* Render test cases in this folder */}
          {testCasesInFolder.map(testCase => (
            <TreeNode
              key={testCase.id}
              testCase={testCase}
              level={level + 1}
              isDragging={dragState.dragging === testCase.id}
              onExecuteTest={onExecuteTest}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              selectedNodeId={selectedNodeId}
              onSelect={setSelectedNodeId}
            />
          ))}
        </TreeFolder>
      </div>
    );
  };

  const unassignedTestCases = testCases.filter(tc => 
    treeData.unassignedTestCaseIds.includes(tc.id)
  );

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center gap-3 p-3">
              <div className="w-4 h-4 bg-surface-200 rounded"></div>
              <div className="w-4 h-4 bg-surface-200 rounded"></div>
              <div className="flex-1 h-4 bg-surface-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (testCases.length === 0) {
    return (
      <EmptyState
        iconName="FileCheck"
        title="No Test Cases Yet"
        message="Create your first test case to get started with the tree view"
        actionText="Create Test Case"
        onAction={onShowCreateForm}
      />
    );
  }

  return (
    <motion.div
      ref={treeRef}
      tabIndex={0}
      className="focus:outline-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-1">
        {/* Root folders */}
        {treeData.rootFolderIds.map(folderId => {
          const folder = treeData.folders.find(f => f.id === folderId);
          return folder ? renderTreeFolder(folder) : null;
        })}

        {/* Unassigned test cases */}
        {unassignedTestCases.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2 text-sm text-surface-600">
              <ApperIcon name="Folder" size={16} />
              <span>Unassigned Test Cases ({unassignedTestCases.length})</span>
            </div>
            {unassignedTestCases.map(testCase => (
              <TreeNode
                key={testCase.id}
                testCase={testCase}
                level={1}
                isDragging={dragState.dragging === testCase.id}
                onExecuteTest={onExecuteTest}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                selectedNodeId={selectedNodeId}
                onSelect={setSelectedNodeId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Help text */}
      <div className="mt-6 p-3 bg-surface-50 rounded-lg text-xs text-surface-600">
        <p className="font-medium mb-1">Keyboard shortcuts:</p>
        <div className="grid grid-cols-2 gap-1">
          <span>↑↓ Navigate</span>
          <span>←→ Expand/Collapse</span>
          <span>Enter Execute/Toggle</span>
          <span>F2 Rename</span>
          <span>Del Delete</span>
          <span>Ctrl+← Collapse All</span>
        </div>
      </div>
    </motion.div>
  );
};

export default TreeView;