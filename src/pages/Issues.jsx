import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { issueService } from '../services';

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filters, setFilters] = useState({
    severity: 'all',
    status: 'all',
    search: ''
  });

  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    severity: 'medium',
    category: '',
    reproductionSteps: ''
  });

  useEffect(() => {
    loadIssues();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [issues, filters]);

  const loadIssues = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await issueService.getAll();
      setIssues(data);
    } catch (err) {
      setError(err.message || 'Failed to load issues');
      toast.error('Failed to load issues');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...issues];

    if (filters.severity !== 'all') {
      filtered = filtered.filter(issue => issue.severity === filters.severity);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(issue => issue.status === filters.status);
    }

    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(issue => 
        issue.title.toLowerCase().includes(searchTerm) ||
        issue.description.toLowerCase().includes(searchTerm) ||
        issue.category.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredIssues(filtered);
  };

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    try {
      const newIssue = await issueService.create(createForm);
      setIssues([...issues, newIssue]);
      setCreateForm({
        title: '',
        description: '',
        severity: 'medium',
        category: '',
        reproductionSteps: ''
      });
      setShowCreateForm(false);
      toast.success('Issue reported successfully');
    } catch (err) {
      toast.error('Failed to create issue');
    }
  };

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      const updatedIssue = await issueService.update(issueId, { 
        status: newStatus,
        resolvedAt: newStatus === 'closed' ? new Date().toISOString() : null
      });
      
      setIssues(issues.map(issue => 
        issue.id === issueId ? updatedIssue : issue
      ));
      
      toast.success(`Issue status updated to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update issue status');
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-surface-100 text-surface-800 border-surface-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'fixed': return 'bg-green-100 text-green-800';
      case 'verified': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-surface-100 text-surface-800';
      default: return 'bg-surface-100 text-surface-800';
    }
  };

  const getStatusOptions = (currentStatus) => {
    const statusFlow = {
      'new': ['in_progress'],
      'in_progress': ['fixed'],
      'fixed': ['verified', 'in_progress'],
      'verified': ['closed', 'in_progress'],
      'closed': ['in_progress']
    };
    return statusFlow[currentStatus] || [];
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-surface-200 rounded w-24 animate-pulse"></div>
          <div className="h-10 bg-surface-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-surface-200 p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                <div className="h-3 bg-surface-200 rounded w-1/2"></div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-surface-200 rounded w-16"></div>
                  <div className="h-6 bg-surface-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg border border-surface-200 p-8 text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Error Loading Issues</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadIssues}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-surface-900">Issues</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <ApperIcon name="Bug" size={16} />
            <span>Report Issue</span>
          </motion.button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-surface-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search issues..."
                className="w-full px-3 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Severity</label>
              <select
                value={filters.severity}
                onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="fixed">Fixed</option>
                <option value="verified">Verified</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="flex items-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilters({ severity: 'all', status: 'all', search: '' })}
                className="px-4 py-2 text-surface-600 border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors text-sm"
              >
                Clear Filters
              </motion.button>
            </div>
          </div>
        </div>

        {/* Issues List */}
        {filteredIssues.length === 0 ? (
          <div className="bg-white rounded-lg border border-surface-200 p-8 text-center">
            <ApperIcon name="Bug" className="w-12 h-12 text-surface-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900 mb-2">
              {issues.length === 0 ? 'No Issues Yet' : 'No Issues Found'}
            </h3>
            <p className="text-surface-600 mb-4">
              {issues.length === 0 
                ? 'Report your first issue to get started'
                : 'Try adjusting your filters to find issues'
              }
            </p>
            {issues.length === 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Report Issue
              </motion.button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredIssues.map((issue, index) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-lg border border-surface-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-surface-900 break-words">
                        {issue.title}
                      </h3>
                    </div>
                    <p className="text-surface-600 mb-3 break-words">
                      {issue.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(issue.severity)}`}>
                        {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)} Severity
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                        {issue.status.charAt(0).toUpperCase() + issue.status.slice(1).replace('_', ' ')}
                      </span>
                      {issue.category && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-surface-100 text-surface-800">
                          {issue.category}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-surface-500">
                      Reported: {new Date(issue.reportedAt).toLocaleDateString()}
                      {issue.resolvedAt && (
                        <span> • Resolved: {new Date(issue.resolvedAt).toLocaleDateString()}</span>
                      )}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 lg:ml-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedIssue(issue);
                        setShowDetailModal(true);
                      }}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-surface-100 text-surface-700 rounded-lg hover:bg-surface-200 transition-colors text-sm"
                    >
                      <ApperIcon name="Eye" size={16} />
                      <span>View</span>
                    </motion.button>
                    {getStatusOptions(issue.status).length > 0 && (
                      <div className="relative">
                        <select
                          onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                          value=""
                          className="px-4 py-2 bg-primary text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
                        >
                          <option value="">Update Status</option>
                          {getStatusOptions(issue.status).map(status => (
                            <option key={status} value={status} className="text-surface-900">
                              {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Create Issue Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowCreateForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleCreateIssue} className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-surface-900">Report Issue</h2>
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="p-2 text-surface-400 hover:text-surface-600 rounded-lg hover:bg-surface-100"
                    >
                      <ApperIcon name="X" size={20} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">
                        Issue Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={createForm.title}
                        onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                        className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter a clear, descriptive title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">
                        Description *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={createForm.description}
                        onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                        className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Describe the issue in detail"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">
                          Severity
                        </label>
                        <select
                          value={createForm.severity}
                          onChange={(e) => setCreateForm({ ...createForm, severity: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">
                          Category
                        </label>
                        <input
                          type="text"
                          value={createForm.category}
                          onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                          className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="e.g., UI, Performance, API"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">
                        Reproduction Steps
                      </label>
                      <textarea
                        rows={4}
                        value={createForm.reproductionSteps}
                        onChange={(e) => setCreateForm({ ...createForm, reproductionSteps: e.target.value })}
                        className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Step-by-step instructions to reproduce the issue"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowCreateForm(false)}
                      className="px-4 py-2 text-surface-700 border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Report Issue
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Issue Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedIssue && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowDetailModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-surface-900">Issue Details</h2>
                    <button
                      type="button"
                      onClick={() => setShowDetailModal(false)}
                      className="p-2 text-surface-400 hover:text-surface-600 rounded-lg hover:bg-surface-100"
                    >
                      <ApperIcon name="X" size={20} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-surface-900 mb-2">
                        {selectedIssue.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(selectedIssue.severity)}`}>
                          {selectedIssue.severity.charAt(0).toUpperCase() + selectedIssue.severity.slice(1)} Severity
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedIssue.status)}`}>
                          {selectedIssue.status.charAt(0).toUpperCase() + selectedIssue.status.slice(1).replace('_', ' ')}
                        </span>
                        {selectedIssue.category && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-surface-100 text-surface-800">
                            {selectedIssue.category}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-surface-900 mb-2">Description</h4>
                      <p className="text-surface-700 break-words">{selectedIssue.description}</p>
                    </div>

                    {selectedIssue.reproductionSteps && (
                      <div>
                        <h4 className="font-medium text-surface-900 mb-2">Reproduction Steps</h4>
                        <p className="text-surface-700 whitespace-pre-wrap break-words">
                          {selectedIssue.reproductionSteps}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-surface-900 mb-1">Reported</h4>
                        <p className="text-surface-700 text-sm">
                          {new Date(selectedIssue.reportedAt).toLocaleDateString()}
                        </p>
                      </div>
                      {selectedIssue.resolvedAt && (
                        <div>
                          <h4 className="font-medium text-surface-900 mb-1">Resolved</h4>
                          <p className="text-surface-700 text-sm">
                            {new Date(selectedIssue.resolvedAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Issues;