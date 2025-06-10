import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { testCaseService, issueService, testRunService } from '@/services';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import EmptyState from '@/components/atoms/EmptyState';
import DashboardMetricsGrid from '@/components/organisms/DashboardMetricsGrid';
import DashboardSummarySections from '@/components/organisms/DashboardSummarySections';
import DashboardRecentActivity from '@/components/organisms/DashboardRecentActivity';

const DashboardPage = () => {
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
                        <Card key={i}>
                            <div className="animate-pulse">
                                <div className="h-4 bg-surface-200 rounded w-1/2 mb-4"></div>
                                <div className="h-8 bg-surface-200 rounded w-3/4"></div>
                            </div>
                        </Card>
                    ))}
                </div>
                <Card>
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
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <EmptyState
                    iconName="AlertCircle"
                    title="Error Loading Dashboard"
                    message={error}
                    actionText="Try Again"
                    onAction={loadDashboardData}
                />
            </div>
        );
    }

    if (!metrics) {
        return (
            <div className="p-6">
                <EmptyState
                    iconName="BarChart3"
                    title="No Data Available"
                    message="Start by creating test cases and running tests"
                />
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
                <h1 className="text-2xl font-bold text-surface-900 mb-6">Dashboard</h1>
                <DashboardMetricsGrid metrics={metrics} />
                <DashboardSummarySections metrics={metrics} />
                <DashboardRecentActivity recentActivity={recentActivity} />
            </motion.div>
        </div>
    );
};

export default DashboardPage;