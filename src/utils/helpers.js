export const getPriorityColor = (priority) => {
    switch (priority) {
        case 'high': return 'bg-red-100 text-red-800';
        case 'medium': return 'bg-yellow-100 text-yellow-800';
        case 'low': return 'bg-green-100 text-green-800';
        default: return 'bg-surface-100 text-surface-800';
    }
};

export const getStatusColor = (status) => {
    switch (status) {
        case 'passed': return 'bg-green-100 text-green-800';
        case 'failed': return 'bg-red-100 text-red-800';
        case 'blocked': return 'bg-yellow-100 text-yellow-800';
        case 'new': return 'bg-blue-100 text-blue-800';
        case 'in_progress': return 'bg-yellow-100 text-yellow-800';
        case 'fixed': return 'bg-green-100 text-green-800';
        case 'verified': return 'bg-green-100 text-green-800';
        case 'closed': return 'bg-surface-100 text-surface-800';
        default: return 'bg-surface-100 text-surface-800';
    }
};

export const getSeverityColor = (severity) => {
    switch (severity) {
        case 'critical': return 'bg-red-100 text-red-800 border-red-200';
        case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'low': return 'bg-green-100 text-green-800 border-green-200';
        default: return 'bg-surface-100 text-surface-800 border-surface-200';
    }
};

export const getStatusOptions = (currentStatus) => {
    const statusFlow = {
        'new': ['in_progress'],
        'in_progress': ['fixed'],
        'fixed': ['verified', 'in_progress'],
        'verified': ['closed', 'in_progress'],
        'closed': ['in_progress']
    };
    return statusFlow[currentStatus] || [];
};

export const formatStatus = (status) => {
    if (!status) return 'Not Run';
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
};

export const getTreeNodeStatus = (testCases, folder) => {
    if (!folder || !folder.testCaseIds || folder.testCaseIds.length === 0) {
        return 'empty';
    }
    
    const folderTestCases = testCases.filter(tc => folder.testCaseIds.includes(tc.id));
    const statusCounts = folderTestCases.reduce((acc, tc) => {
        const status = tc.lastRunStatus || 'not_run';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});
    
    if (statusCounts.failed > 0) return 'failed';
    if (statusCounts.passed === folderTestCases.length) return 'passed';
    if (statusCounts.passed > 0) return 'partial';
    return 'not_run';
};

export const getFolderTestCaseStats = (testCases, folder) => {
    if (!folder || !folder.testCaseIds) {
        return { total: 0, passed: 0, failed: 0, notRun: 0 };
    }
    
    const folderTestCases = testCases.filter(tc => folder.testCaseIds.includes(tc.id));
    
    return folderTestCases.reduce((stats, tc) => {
        stats.total++;
        const status = tc.lastRunStatus || 'not_run';
        
        switch (status) {
            case 'passed':
                stats.passed++;
                break;
            case 'failed':
                stats.failed++;
                break;
            default:
                stats.notRun++;
                break;
        }
        
        return stats;
    }, { total: 0, passed: 0, failed: 0, notRun: 0 });
};

export const buildTreeStructure = (folders, rootFolderIds, testCases) => {
    const folderMap = new Map(folders.map(f => [f.id, { ...f, children: [] }]));
    const tree = [];
    
    // Build hierarchy
    folders.forEach(folder => {
        const folderNode = folderMap.get(folder.id);
        if (folder.parentId && folderMap.has(folder.parentId)) {
            folderMap.get(folder.parentId).children.push(folderNode);
        }
    });
    
    // Add root folders to tree
    rootFolderIds.forEach(id => {
        if (folderMap.has(id)) {
            tree.push(folderMap.get(id));
        }
    });
    
    return tree;
};