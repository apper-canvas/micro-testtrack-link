import treeData from '../mockData/treeData.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TreeService {
  constructor() {
    this.data = {
      folders: [...treeData.folders],
      rootFolderIds: [...treeData.rootFolderIds],
      unassignedTestCaseIds: [...treeData.unassignedTestCaseIds]
    };
    this.expandedState = new Set();
    this.loadExpandedState();
  }

  // Folder CRUD Operations
  async getAllFolders() {
    await delay(200);
    return [...this.data.folders];
  }

  async getFolderById(id) {
    await delay(150);
    const folder = this.data.folders.find(f => f.id === id);
    return folder ? { ...folder } : null;
  }

  async createFolder(folderData) {
    await delay(300);
    const newFolder = {
      ...folderData,
      id: `folder_${Date.now()}`,
      testCaseIds: [],
      childFolderIds: [],
      expanded: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.folders.push(newFolder);

    if (!newFolder.parentId) {
      this.data.rootFolderIds.push(newFolder.id);
    } else {
      const parent = this.data.folders.find(f => f.id === newFolder.parentId);
      if (parent) {
        parent.childFolderIds.push(newFolder.id);
        parent.updatedAt = new Date().toISOString();
      }
    }

    this.expandedState.add(newFolder.id);
    this.saveExpandedState();
    return { ...newFolder };
  }

  async updateFolder(id, updates) {
    await delay(250);
    const index = this.data.folders.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Folder not found');

    this.data.folders[index] = {
      ...this.data.folders[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return { ...this.data.folders[index] };
  }

  async deleteFolder(id) {
    await delay(300);
    const folder = this.data.folders.find(f => f.id === id);
    if (!folder) throw new Error('Folder not found');

    // Move child folders to parent or root
    const childFolders = this.data.folders.filter(f => f.parentId === id);
    childFolders.forEach(child => {
      child.parentId = folder.parentId;
      child.updatedAt = new Date().toISOString();
    });

    // Move test cases to unassigned
    this.data.unassignedTestCaseIds.push(...folder.testCaseIds);

    // Update parent folder
    if (folder.parentId) {
      const parent = this.data.folders.find(f => f.id === folder.parentId);
      if (parent) {
        parent.childFolderIds = parent.childFolderIds.filter(cid => cid !== id);
        parent.childFolderIds.push(...folder.childFolderIds);
        parent.updatedAt = new Date().toISOString();
      }
    } else {
      this.data.rootFolderIds = this.data.rootFolderIds.filter(rid => rid !== id);
      this.data.rootFolderIds.push(...folder.childFolderIds);
    }

    // Remove folder
    this.data.folders = this.data.folders.filter(f => f.id !== id);
    this.expandedState.delete(id);
    this.saveExpandedState();

    return { ...folder };
  }

  // Test Case Assignment
  async moveTestCaseToFolder(testCaseId, targetFolderId) {
    await delay(200);
    
    // Remove from current location
    this.data.folders.forEach(folder => {
      folder.testCaseIds = folder.testCaseIds.filter(tcId => tcId !== testCaseId);
    });
    this.data.unassignedTestCaseIds = this.data.unassignedTestCaseIds.filter(tcId => tcId !== testCaseId);

    // Add to target folder
    if (targetFolderId) {
      const targetFolder = this.data.folders.find(f => f.id === targetFolderId);
      if (targetFolder) {
        targetFolder.testCaseIds.push(testCaseId);
        targetFolder.updatedAt = new Date().toISOString();
      }
    } else {
      this.data.unassignedTestCaseIds.push(testCaseId);
    }

    return true;
  }

  async moveFolderToFolder(folderId, targetFolderId) {
    await delay(250);
    const folder = this.data.folders.find(f => f.id === folderId);
    if (!folder) throw new Error('Folder not found');

    // Prevent moving folder into itself or its descendants
    if (this.isDescendant(targetFolderId, folderId)) {
      throw new Error('Cannot move folder into itself or its descendants');
    }

    // Remove from current parent
    if (folder.parentId) {
      const currentParent = this.data.folders.find(f => f.id === folder.parentId);
      if (currentParent) {
        currentParent.childFolderIds = currentParent.childFolderIds.filter(cid => cid !== folderId);
        currentParent.updatedAt = new Date().toISOString();
      }
    } else {
      this.data.rootFolderIds = this.data.rootFolderIds.filter(rid => rid !== folderId);
    }

    // Add to new parent
    folder.parentId = targetFolderId;
    folder.updatedAt = new Date().toISOString();

    if (targetFolderId) {
      const newParent = this.data.folders.find(f => f.id === targetFolderId);
      if (newParent) {
        newParent.childFolderIds.push(folderId);
        newParent.updatedAt = new Date().toISOString();
      }
    } else {
      this.data.rootFolderIds.push(folderId);
    }

    return { ...folder };
  }

  // Folder State Management
  async toggleFolderExpanded(folderId) {
    await delay(100);
    if (this.expandedState.has(folderId)) {
      this.expandedState.delete(folderId);
    } else {
      this.expandedState.add(folderId);
    }
    this.saveExpandedState();
    return this.expandedState.has(folderId);
  }

  async setFolderExpanded(folderId, expanded) {
    await delay(100);
    if (expanded) {
      this.expandedState.add(folderId);
    } else {
      this.expandedState.delete(folderId);
    }
    this.saveExpandedState();
    return expanded;
  }

  isFolderExpanded(folderId) {
    return this.expandedState.has(folderId);
  }

  // Tree Structure Helpers
  async getTreeStructure() {
    await delay(200);
    const structure = {
      folders: [...this.data.folders],
      rootFolderIds: [...this.data.rootFolderIds],
      unassignedTestCaseIds: [...this.data.unassignedTestCaseIds],
      expandedState: new Set(this.expandedState)
    };
    return structure;
  }

  isDescendant(potentialDescendant, ancestorId) {
    if (!potentialDescendant) return false;
    
    const folder = this.data.folders.find(f => f.id === potentialDescendant);
    if (!folder) return false;
    
    if (folder.parentId === ancestorId) return true;
    return this.isDescendant(folder.parentId, ancestorId);
  }

  getFolderPath(folderId) {
    const path = [];
    let currentId = folderId;
    
    while (currentId) {
      const folder = this.data.folders.find(f => f.id === currentId);
      if (!folder) break;
      path.unshift(folder.name);
      currentId = folder.parentId;
    }
    
    return path;
  }

  // Persistence Simulation
  saveExpandedState() {
    try {
      localStorage.setItem('treeExpandedState', JSON.stringify([...this.expandedState]));
    } catch (error) {
      console.warn('Failed to save tree state:', error);
    }
  }

  loadExpandedState() {
    try {
      const saved = localStorage.getItem('treeExpandedState');
      if (saved) {
        this.expandedState = new Set(JSON.parse(saved));
      } else {
        // Initialize with default expanded folders
        this.data.folders.forEach(folder => {
          if (folder.expanded) {
            this.expandedState.add(folder.id);
          }
        });
      }
    } catch (error) {
      console.warn('Failed to load tree state:', error);
      this.expandedState = new Set();
    }
  }

  // Bulk Operations
  async runAllTestsInFolder(folderId) {
    await delay(500);
    const folder = this.data.folders.find(f => f.id === folderId);
    if (!folder) throw new Error('Folder not found');

    // Simulate running all tests in folder and subfolders
    const allTestCaseIds = this.getAllTestCaseIdsInFolder(folderId);
    return {
      folderId,
      testCaseIds: allTestCaseIds,
      message: `Started execution of ${allTestCaseIds.length} test cases`
    };
  }

  getAllTestCaseIdsInFolder(folderId) {
    const folder = this.data.folders.find(f => f.id === folderId);
    if (!folder) return [];

    let testCaseIds = [...folder.testCaseIds];
    
    // Recursively get test cases from child folders
    folder.childFolderIds.forEach(childId => {
      testCaseIds.push(...this.getAllTestCaseIdsInFolder(childId));
    });

    return testCaseIds;
  }
}

export default new TreeService();