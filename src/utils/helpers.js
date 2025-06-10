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