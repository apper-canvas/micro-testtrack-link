import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { testCaseService, issueService, testRunService } from '../services';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [testCases, issues, testRuns] = await Promise.all([
        testCaseService.getAll(),
        issueService.getAll(),
        testRunService.getAll()
      ]);

      // Calculate metrics
      const totalTestCases = testCases.length;
      const passedTests = testRuns.filter(run => run.status === 'passed').length;
      const failedTests = testRuns.filter(run => run.status === 'failed').length;
      const testCoverage = totalTestCases > 0 ? Math.round((testRuns.length / totalTestCases) * 100) : 0;

      const openIssues = issues.filter(issue => !['closed', 'verified'].includes(issue.status)).length;
      const criticalIssues = issues.filter(issue => issue.severity === 'critical' && !['closed', 'verified'].includes(issue.status)).length;
      const resolvedIssues = issues.filter(issue => ['fixed', 'verified', 'closed'].includes(issue.status)).length;

      setMetrics({
        totalTestCases,
        testCoverage,
        passedTests,
        failedTests,
        openIssues,
        criticalIssues,
        resolvedIssues
      });

      // Generate recent activity
      const activity = [
        ...testRuns.slice(-5).map(run => ({
          id: run.id,
          type: 'test_execution',
          description: `Test case executed with ${run.status} status`,
          timestamp: run.executedAt,
          status: run.status
        })),
        ...issues.slice(-3).map(issue => ({
          id: issue.id,
          type: 'issue_reported',
          description: `New ${issue.severity} issue: ${issue.title}`,
          timestamp: issue.reportedAt,
          status: issue.status
        }))
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 8);

      setRecentActivity(activity);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-surface-200 p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-surface-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-surface-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg border border-surface-200 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-surface-200 rounded w-1/4 mb-6"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-surface-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-surface-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-surface-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg border border-surface-200 p-8 text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadDashboardData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </motion.button>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg border border-surface-200 p-8 text-center">
          <ApperIcon name="BarChart3" className="w-12 h-12 text-surface-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">No Data Available</h3>
          <p className="text-surface-600">Start by creating test cases and running tests</p>
        </div>
      </div>
    );
  }

  const metricCards = [
    {
      title: 'Test Coverage',
      value: `${metrics.testCoverage}%`,
      icon: 'Target',
      color: metrics.testCoverage >= 80 ? 'text-green-600' : metrics.testCoverage >= 60 ? 'text-yellow-600' : 'text-red-600',
      bgColor: metrics.testCoverage >= 80 ? 'bg-green-50' : metrics.testCoverage >= 60 ? 'bg-yellow-50' : 'bg-red-50'
    },
    {
      title: 'Total Test Cases',
      value: metrics.totalTestCases,
      icon: 'FileCheck',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Open Issues',
      value: metrics.openIssues,
      icon: 'Bug',
      color: metrics.openIssues === 0 ? 'text-green-600' : 'text-red-600',
      bgColor: metrics.openIssues === 0 ? 'bg-green-50' : 'bg-red-50'
    },
    {
      title: 'Critical Issues',
      value: metrics.criticalIssues,
      icon: 'AlertTriangle',
      color: metrics.criticalIssues === 0 ? 'text-green-600' : 'text-red-600',
      bgColor: metrics.criticalIssues === 0 ? 'bg-green-50' : 'bg-red-50'
    }
  ];

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-surface-900 mb-6">Dashboard</h1>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricCards.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-lg border border-surface-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-600 mb-1 break-words">
                    {metric.title}
                  </p>
                  <p className={`text-2xl font-bold ${metric.color}`}>
                    {metric.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <ApperIcon name={metric.icon} className={`w-6 h-6 ${metric.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Test Execution Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white rounded-lg border border-surface-200 p-6"
          >
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Test Execution Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-surface-700">Passed</span>
                </div>
                <span className="font-semibold text-surface-900">{metrics.passedTests}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-surface-700">Failed</span>
                </div>
                <span className="font-semibold text-surface-900">{metrics.failedTests}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white rounded-lg border border-surface-200 p-6"
          >
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Issue Resolution</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-surface-700">Open Issues</span>
                </div>
                <span className="font-semibold text-surface-900">{metrics.openIssues}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-surface-700">Resolved</span>
                </div>
                <span className="font-semibold text-surface-900">{metrics.resolvedIssues}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="bg-white rounded-lg border border-surface-200 p-6"
        >
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Recent Activity</h3>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Activity" className="w-12 h-12 text-surface-300 mx-auto mb-4" />
              <p className="text-surface-600">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4 max-w-full overflow-hidden">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center space-x-4 max-w-full"
                >
                  <div className={`p-2 rounded-full ${
                    activity.type === 'test_execution' 
                      ? activity.status === 'passed' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                      : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    <ApperIcon 
                      name={activity.type === 'test_execution' ? 'Play' : 'Bug'} 
                      size={16} 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-surface-900 text-sm break-words">
                      {activity.description}
                    </p>
                    <p className="text-surface-500 text-xs">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;