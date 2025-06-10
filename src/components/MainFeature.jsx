import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import { testCaseService, issueService, testRunService } from '../services';

const MainFeature = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentTestRuns, setRecentTestRuns] = useState([]);
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [testCases, issues, testRuns] = await Promise.all([
        testCaseService.getAll(),
        issueService.getAll(),
        testRunService.getAll()
      ]);

      // Calculate quick stats
      const totalTestCases = testCases.length;
      const executedTests = testRuns.length;
      const passedTests = testRuns.filter(run => run.status === 'passed').length;
      const openIssues = issues.filter(issue => !['closed', 'verified'].includes(issue.status)).length;
      const criticalIssues = issues.filter(issue => issue.severity === 'critical' && !['closed', 'verified'].includes(issue.status)).length;

      setStats({
        totalTestCases,
        executedTests,
        passedTests,
        openIssues,
        criticalIssues,
        testCoverage: totalTestCases > 0 ? Math.round((executedTests / totalTestCases) * 100) : 0
      });

      // Get recent activity
      setRecentTestRuns(testRuns.slice(-3).reverse());
      setRecentIssues(issues.slice(-3).reverse());

    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Execute Test',
      description: 'Run test cases and record results',
      icon: 'Play',
      color: 'bg-green-500',
      action: () => navigate('/test-cases')
    },
    {
      title: 'Report Bug',
      description: 'Document and track new issues',
      icon: 'Bug',
      color: 'bg-red-500',
      action: () => navigate('/issues')
    },
    {
      title: 'View Reports',
      description: 'Analyze testing metrics and trends',
      icon: 'BarChart3',
      color: 'bg-blue-500',
      action: () => navigate('/reports')
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed': return 'text-green-600 bg-green-50';
      case 'failed': return 'text-red-600 bg-red-50';
      case 'blocked': return 'text-yellow-600 bg-yellow-50';
      case 'new': return 'text-blue-600 bg-blue-50';
      case 'in_progress': return 'text-yellow-600 bg-yellow-50';
      case 'fixed': return 'text-green-600 bg-green-50';
      default: return 'text-surface-600 bg-surface-50';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-surface-600 bg-surface-50';
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-surface-200 p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                <div className="h-6 bg-surface-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="space-y-8"
    >
      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-surface-900 mb-4">Get Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.action}
              className="bg-white rounded-lg border border-surface-200 p-6 cursor-pointer hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${action.color}`}>
                  <ApperIcon name={action.icon} className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-surface-900 mb-1">
                    {action.title}
                  </h3>
                  <p className="text-surface-600 text-sm break-words">
                    {action.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div>
          <h2 className="text-xl font-bold text-surface-900 mb-4">Quick Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-lg border border-surface-200 p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalTestCases}</div>
              <div className="text-sm text-surface-600">Test Cases</div>
            </div>
            <div className="bg-white rounded-lg border border-surface-200 p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.testCoverage}%</div>
              <div className="text-sm text-surface-600">Coverage</div>
            </div>
            <div className="bg-white rounded-lg border border-surface-200 p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.passedTests}</div>
              <div className="text-sm text-surface-600">Passed</div>
            </div>
            <div className="bg-white rounded-lg border border-surface-200 p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.openIssues}</div>
              <div className="text-sm text-surface-600">Open Issues</div>
            </div>
            <div className="bg-white rounded-lg border border-surface-200 p-4 text-center">
              <div className="text-2xl font-bold text-red-700">{stats.criticalIssues}</div>
              <div className="text-sm text-surface-600">Critical</div>
            </div>
            <div className="bg-white rounded-lg border border-surface-200 p-4 text-center">
              <div className="text-2xl font-bold text-surface-900">{stats.executedTests}</div>
              <div className="text-sm text-surface-600">Executed</div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Test Runs */}
        <div className="bg-white rounded-lg border border-surface-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-surface-900">Recent Test Runs</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/test-cases')}
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              View All
            </motion.button>
          </div>
          {recentTestRuns.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Play" className="w-8 h-8 text-surface-300 mx-auto mb-2" />
              <p className="text-surface-600 text-sm">No test runs yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTestRuns.map((run) => (
                <div key={run.id} className="flex items-center justify-between p-3 bg-surface-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-900 break-words">
                      Test Case #{run.testCaseId.slice(-6)}
                    </p>
                    <p className="text-xs text-surface-500">
                      {new Date(run.executedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(run.status)}`}>
                    {run.status.charAt(0).toUpperCase() + run.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Issues */}
        <div className="bg-white rounded-lg border border-surface-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-surface-900">Recent Issues</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/issues')}
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              View All
            </motion.button>
          </div>
          {recentIssues.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Bug" className="w-8 h-8 text-surface-300 mx-auto mb-2" />
              <p className="text-surface-600 text-sm">No issues reported</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentIssues.map((issue) => (
                <div key={issue.id} className="p-3 bg-surface-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-surface-900 break-words flex-1 min-w-0">
                      {issue.title}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${getSeverityColor(issue.severity)}`}>
                      {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-surface-500">
                      {new Date(issue.reportedAt).toLocaleDateString()}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                      {issue.status.charAt(0).toUpperCase() + issue.status.slice(1).replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MainFeature;