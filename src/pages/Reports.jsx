import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Chart from 'react-apexcharts';
import ApperIcon from '../components/ApperIcon';
import { testCaseService, issueService, testRunService } from '../services';

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30');

  useEffect(() => {
    loadReportData();
  }, [selectedTimeRange]);

  const loadReportData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [testCases, issues, testRuns] = await Promise.all([
        testCaseService.getAll(),
        issueService.getAll(),
        testRunService.getAll()
      ]);

      // Filter data based on time range
      const daysAgo = parseInt(selectedTimeRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

      const filteredTestRuns = testRuns.filter(run => 
        new Date(run.executedAt) >= cutoffDate
      );
      const filteredIssues = issues.filter(issue => 
        new Date(issue.reportedAt) >= cutoffDate
      );

      // Test execution metrics
      const totalTestRuns = filteredTestRuns.length;
      const passedTests = filteredTestRuns.filter(run => run.status === 'passed').length;
      const failedTests = filteredTestRuns.filter(run => run.status === 'failed').length;
      const blockedTests = filteredTestRuns.filter(run => run.status === 'blocked').length;

      // Issue metrics
      const totalIssues = filteredIssues.length;
      const criticalIssues = filteredIssues.filter(issue => issue.severity === 'critical').length;
      const highIssues = filteredIssues.filter(issue => issue.severity === 'high').length;
      const mediumIssues = filteredIssues.filter(issue => issue.severity === 'medium').length;
      const lowIssues = filteredIssues.filter(issue => issue.severity === 'low').length;

      const openIssues = filteredIssues.filter(issue => 
        !['closed', 'verified'].includes(issue.status)
      ).length;
      const resolvedIssues = filteredIssues.filter(issue => 
        ['fixed', 'verified', 'closed'].includes(issue.status)
      ).length;

      // Test coverage
      const testCoverage = testCases.length > 0 ? 
        Math.round((testRuns.length / testCases.length) * 100) : 0;

      // Chart data for test execution trend
      const testExecutionChart = {
        series: [{
          name: 'Passed',
          data: [passedTests]
        }, {
          name: 'Failed',
          data: [failedTests]
        }, {
          name: 'Blocked',
          data: [blockedTests]
        }],
        options: {
          chart: {
            type: 'bar',
            height: 350,
            toolbar: { show: false }
          },
          colors: ['#22C55E', '#EF4444', '#F59E0B'],
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '55%',
            },
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
          },
          xaxis: {
            categories: ['Test Results'],
          },
          yaxis: {
            title: {
              text: 'Number of Tests'
            }
          },
          fill: {
            opacity: 1
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return val + " tests"
              }
            }
          },
          legend: {
            position: 'top'
          }
        }
      };

      // Chart data for issue severity distribution
      const issueSeverityChart = {
        series: [criticalIssues, highIssues, mediumIssues, lowIssues],
        options: {
          chart: {
            type: 'donut',
            height: 350
          },
          colors: ['#EF4444', '#F59E0B', '#3B82F6', '#22C55E'],
          labels: ['Critical', 'High', 'Medium', 'Low'],
          legend: {
            position: 'bottom'
          },
          plotOptions: {
            pie: {
              donut: {
                size: '60%'
              }
            }
          }
        }
      };

      setReportData({
        testExecution: {
          total: totalTestRuns,
          passed: passedTests,
          failed: failedTests,
          blocked: blockedTests,
          passRate: totalTestRuns > 0 ? Math.round((passedTests / totalTestRuns) * 100) : 0
        },
        issues: {
          total: totalIssues,
          critical: criticalIssues,
          high: highIssues,
          medium: mediumIssues,
          low: lowIssues,
          open: openIssues,
          resolved: resolvedIssues,
          resolutionRate: totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0
        },
        coverage: {
          testCoverage
        },
        charts: {
          testExecution: testExecutionChart,
          issueSeverity: issueSeverityChart
        }
      });

    } catch (err) {
      setError(err.message || 'Failed to load report data');
      toast.error('Failed to load report data');
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-surface-200 p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-surface-200 rounded w-1/3 mb-4"></div>
                <div className="h-64 bg-surface-200 rounded"></div>
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
          <h3 className="text-lg font-medium text-surface-900 mb-2">Error Loading Reports</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadReportData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </motion.button>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg border border-surface-200 p-8 text-center">
          <ApperIcon name="BarChart3" className="w-12 h-12 text-surface-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">No Report Data Available</h3>
          <p className="text-surface-600">Execute tests and report issues to generate reports</p>
        </div>
      </div>
    );
  }

  const summaryCards = [
    {
      title: 'Test Pass Rate',
      value: `${reportData.testExecution.passRate}%`,
      icon: 'Target',
      color: reportData.testExecution.passRate >= 80 ? 'text-green-600' : 
             reportData.testExecution.passRate >= 60 ? 'text-yellow-600' : 'text-red-600',
      bgColor: reportData.testExecution.passRate >= 80 ? 'bg-green-50' : 
               reportData.testExecution.passRate >= 60 ? 'bg-yellow-50' : 'bg-red-50'
    },
    {
      title: 'Tests Executed',
      value: reportData.testExecution.total,
      icon: 'Play',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Open Issues',
      value: reportData.issues.open,
      icon: 'AlertTriangle',
      color: reportData.issues.open === 0 ? 'text-green-600' : 'text-red-600',
      bgColor: reportData.issues.open === 0 ? 'bg-green-50' : 'bg-red-50'
    },
    {
      title: 'Resolution Rate',
      value: `${reportData.issues.resolutionRate}%`,
      icon: 'CheckCircle',
      color: reportData.issues.resolutionRate >= 80 ? 'text-green-600' : 
             reportData.issues.resolutionRate >= 60 ? 'text-yellow-600' : 'text-red-600',
      bgColor: reportData.issues.resolutionRate >= 80 ? 'bg-green-50' : 
               reportData.issues.resolutionRate >= 60 ? 'bg-yellow-50' : 'bg-red-50'
    }
  ];

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-surface-900">Reports</h1>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-surface-700">Time Range:</label>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-3 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-lg border border-surface-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-600 mb-1 break-words">
                    {card.title}
                  </p>
                  <p className={`text-2xl font-bold ${card.color}`}>
                    {card.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <ApperIcon name={card.icon} className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white rounded-lg border border-surface-200 p-6"
          >
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Test Execution Results</h3>
            {reportData.testExecution.total > 0 ? (
              <Chart
                options={reportData.charts.testExecution.options}
                series={reportData.charts.testExecution.series}
                type="bar"
                height={350}
              />
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <ApperIcon name="BarChart3" className="w-12 h-12 text-surface-300 mx-auto mb-2" />
                  <p className="text-surface-600">No test execution data</p>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white rounded-lg border border-surface-200 p-6"
          >
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Issue Severity Distribution</h3>
            {reportData.issues.total > 0 ? (
              <Chart
                options={reportData.charts.issueSeverity.options}
                series={reportData.charts.issueSeverity.series}
                type="donut"
                height={350}
              />
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <ApperIcon name="PieChart" className="w-12 h-12 text-surface-300 mx-auto mb-2" />
                  <p className="text-surface-600">No issue data</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-white rounded-lg border border-surface-200 p-6"
          >
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Test Execution Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-surface-700">Passed Tests</span>
                </div>
                <span className="font-semibold text-surface-900">{reportData.testExecution.passed}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-surface-700">Failed Tests</span>
                </div>
                <span className="font-semibold text-surface-900">{reportData.testExecution.failed}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-surface-700">Blocked Tests</span>
                </div>
                <span className="font-semibold text-surface-900">{reportData.testExecution.blocked}</span>
              </div>
              <div className="border-t border-surface-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-surface-900">Total Tests Executed</span>
                  <span className="font-bold text-surface-900">{reportData.testExecution.total}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="bg-white rounded-lg border border-surface-200 p-6"
          >
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Issue Analysis</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-surface-700">Critical Issues</span>
                </div>
                <span className="font-semibold text-surface-900">{reportData.issues.critical}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-surface-700">High Priority</span>
                </div>
                <span className="font-semibold text-surface-900">{reportData.issues.high}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-surface-700">Medium Priority</span>
                </div>
                <span className="font-semibold text-surface-900">{reportData.issues.medium}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-surface-700">Low Priority</span>
                </div>
                <span className="font-semibold text-surface-900">{reportData.issues.low}</span>
              </div>
              <div className="border-t border-surface-200 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-surface-900">Open Issues</span>
                  <span className="font-bold text-red-600">{reportData.issues.open}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-surface-900">Resolved Issues</span>
                  <span className="font-bold text-green-600">{reportData.issues.resolved}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;