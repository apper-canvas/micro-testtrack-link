import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { testCaseService, testRunService } from '../services';

const TestCases = () => {
  const [testCases, setTestCases] = useState([]);
  const [filteredTestCases, setFilteredTestCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showExecuteModal, setShowExecuteModal] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState(null);
  const [filters, setFilters] = useState({
    priority: 'all',
    status: 'all',
    search: ''
  });

  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    steps: [''],
    expectedResult: '',
    priority: 'medium'
  });

  const [executeForm, setExecuteForm] = useState({
    status: 'passed',
    notes: ''
  });

  useEffect(() => {
    loadTestCases();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [testCases, filters]);

  const loadTestCases = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await testCaseService.getAll();
      setTestCases(data);
    } catch (err) {
      setError(err.message || 'Failed to load test cases');
      toast.error('Failed to load test cases');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...testCases];

    if (filters.priority !== 'all') {
      filtered = filtered.filter(tc => tc.priority === filters.priority);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(tc => tc.lastRunStatus === filters.status);
    }

    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(tc => 
        tc.title.toLowerCase().includes(searchTerm) ||
        tc.description.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredTestCases(filtered);
  };

  const handleCreateTestCase = async (e) => {
    e.preventDefault();
    try {
      const newTestCase = await testCaseService.create({
        ...createForm,
        steps: createForm.steps.filter(step => step.trim())
      });
      setTestCases([...testCases, newTestCase]);
      setCreateForm({
        title: '',
        description: '',
        steps: [''],
        expectedResult: '',
        priority: 'medium'
      });
      setShowCreateForm(false);
      toast.success('Test case created successfully');
    } catch (err) {
      toast.error('Failed to create test case');
    }
  };

  const handleExecuteTest = async (e) => {
    e.preventDefault();
    try {
      const testRun = await testRunService.create({
        testCaseId: selectedTestCase.id,
        status: executeForm.status,
        notes: executeForm.notes,
        executedBy: 'Current User'
      });

      // Update test case last run status
      const updatedTestCase = await testCaseService.update(selectedTestCase.id, {
        lastRunStatus: executeForm.status
      });

      setTestCases(testCases.map(tc => 
        tc.id === selectedTestCase.id ? updatedTestCase : tc
      ));

      setExecuteForm({ status: 'passed', notes: '' });
      setShowExecuteModal(false);
      setSelectedTestCase(null);
      toast.success('Test executed successfully');
    } catch (err) {
      toast.error('Failed to execute test');
    }
  };

  const addStep = () => {
    setCreateForm({
      ...createForm,
      steps: [...createForm.steps, '']
    });
  };

  const removeStep = (index) => {
    setCreateForm({
      ...createForm,
      steps: createForm.steps.filter((_, i) => i !== index)
    });
  };

  const updateStep = (index, value) => {
    const newSteps = [...createForm.steps];
    newSteps[index] = value;
    setCreateForm({
      ...createForm,
      steps: newSteps
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-surface-100 text-surface-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'blocked': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-surface-100 text-surface-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-surface-200 rounded w-32 animate-pulse"></div>
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
          <h3 className="text-lg font-medium text-surface-900 mb-2">Error Loading Test Cases</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadTestCases}
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
          <h1 className="text-2xl font-bold text-surface-900">Test Cases</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ApperIcon name="Plus" size={16} />
            <span>Create Test Case</span>
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
                placeholder="Search test cases..."
                className="w-full px-3 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Priorities</option>
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
                <option value="passed">Passed</option>
                <option value="failed">Failed</option>
                <option value="blocked">Blocked</option>
                <option value="not_run">Not Run</option>
              </select>
            </div>
            <div className="flex items-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilters({ priority: 'all', status: 'all', search: '' })}
                className="px-4 py-2 text-surface-600 border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors text-sm"
              >
                Clear Filters
              </motion.button>
            </div>
          </div>
        </div>

        {/* Test Cases List */}
        {filteredTestCases.length === 0 ? (
          <div className="bg-white rounded-lg border border-surface-200 p-8 text-center">
            <ApperIcon name="FileCheck" className="w-12 h-12 text-surface-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900 mb-2">
              {testCases.length === 0 ? 'No Test Cases Yet' : 'No Test Cases Found'}
            </h3>
            <p className="text-surface-600 mb-4">
              {testCases.length === 0 
                ? 'Create your first test case to get started'
                : 'Try adjusting your filters to find test cases'
              }
            </p>
            {testCases.length === 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Create Test Case
              </motion.button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTestCases.map((testCase, index) => (
              <motion.div
                key={testCase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-lg border border-surface-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-surface-900 break-words">
                        {testCase.title}
                      </h3>
                    </div>
                    <p className="text-surface-600 mb-3 break-words">
                      {testCase.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(testCase.priority)}`}>
                        {testCase.priority.charAt(0).toUpperCase() + testCase.priority.slice(1)} Priority
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(testCase.lastRunStatus || 'not_run')}`}>
                        {testCase.lastRunStatus ? 
                          testCase.lastRunStatus.charAt(0).toUpperCase() + testCase.lastRunStatus.slice(1).replace('_', ' ') 
                          : 'Not Run'
                        }
                      </span>
                    </div>
                    <p className="text-xs text-surface-500">
                      Created: {new Date(testCase.createdAt).toLocaleDateString()}
                      {testCase.updatedAt !== testCase.createdAt && (
                        <span> • Updated: {new Date(testCase.updatedAt).toLocaleDateString()}</span>
                      )}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 lg:ml-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedTestCase(testCase);
                        setShowExecuteModal(true);
                      }}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <ApperIcon name="Play" size={16} />
                      <span>Execute</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Create Test Case Modal */}
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
                <form onSubmit={handleCreateTestCase} className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-surface-900">Create Test Case</h2>
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
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={createForm.title}
                        onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                        className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter test case title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">
                        Description *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={createForm.description}
                        onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                        className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter test case description"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">
                        Priority
                      </label>
                      <select
                        value={createForm.priority}
                        onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value })}
                        className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-surface-700">
                          Test Steps *
                        </label>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={addStep}
                          className="flex items-center space-x-1 text-primary hover:text-primary/80 text-sm"
                        >
                          <ApperIcon name="Plus" size={16} />
                          <span>Add Step</span>
                        </motion.button>
                      </div>
                      <div className="space-y-2">
                        {createForm.steps.map((step, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <span className="text-sm text-surface-500 w-8">{index + 1}.</span>
                            <input
                              type="text"
                              value={step}
                              onChange={(e) => updateStep(index, e.target.value)}
                              className="flex-1 px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Enter test step"
                            />
                            {createForm.steps.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeStep(index)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                              >
                                <ApperIcon name="Trash2" size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">
                        Expected Result *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={createForm.expectedResult}
                        onChange={(e) => setCreateForm({ ...createForm, expectedResult: e.target.value })}
                        className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter expected result"
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
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Create Test Case
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Execute Test Modal */}
      <AnimatePresence>
        {showExecuteModal && selectedTestCase && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowExecuteModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleExecuteTest} className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-surface-900">Execute Test Case</h2>
                    <button
                      type="button"
                      onClick={() => setShowExecuteModal(false)}
                      className="p-2 text-surface-400 hover:text-surface-600 rounded-lg hover:bg-surface-100"
                    >
                      <ApperIcon name="X" size={20} />
                    </button>
                  </div>

                  {/* Test Case Details */}
                  <div className="bg-surface-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-surface-900 mb-2">{selectedTestCase.title}</h3>
                    <p className="text-surface-600 mb-3 break-words">{selectedTestCase.description}</p>
                    
                    <div className="mb-3">
                      <h4 className="font-medium text-surface-900 mb-2">Test Steps:</h4>
                      <ol className="space-y-1">
                        {selectedTestCase.steps.map((step, index) => (
                          <li key={index} className="text-sm text-surface-700 break-words">
                            {index + 1}. {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-surface-900 mb-1">Expected Result:</h4>
                      <p className="text-sm text-surface-700 break-words">{selectedTestCase.expectedResult}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">
                        Test Result *
                      </label>
                      <select
                        value={executeForm.status}
                        onChange={(e) => setExecuteForm({ ...executeForm, status: e.target.value })}
                        className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="passed">Passed</option>
                        <option value="failed">Failed</option>
                        <option value="blocked">Blocked</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">
                        Notes
                      </label>
                      <textarea
                        rows={4}
                        value={executeForm.notes}
                        onChange={(e) => setExecuteForm({ ...executeForm, notes: e.target.value })}
                        className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Add any notes about the test execution (optional)"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowExecuteModal(false)}
                      className="px-4 py-2 text-surface-700 border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Submit Result
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TestCases;