import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Chart from 'react-apexcharts';
import ApperIcon from '@/components/ApperIcon';
import { testCaseService, issueService, testRunService } from '@/services';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import EmptyState from '@/components/atoms/EmptyState';
import Select from '@/components/atoms/Select';
import ReportSummaryCards from '@/components/organisms/ReportSummaryCards';
import ReportChartsSection from '@/components/organisms/ReportChartsSection';
import DetailedReportMetrics from '@/components/organisms/DetailedReportMetrics';

const ReportsPage = () => {
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
                        <Card key={i}>
                            <div className="animate-pulse">
                                <div className="h-4 bg-surface-200 rounded w-1/2 mb-4"></div>
                                <div className="h-8 bg-surface-200 rounded w-3/4"></div>
                            </div>
                        </Card>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[...Array(2)].map((_, i) => (
                        <Card key={i}>
                            <div className="animate-pulse">
                                <div className="h-6 bg-surface-200 rounded w-1/3 mb-4"></div>
                                <div className="h-64 bg-surface-200 rounded"></div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <EmptyState
                    iconName="AlertCircle"
                    title="Error Loading Reports"
                    message={error}
                    actionText="Try Again"
                    onAction={loadReportData}
                />
            </div>
        );
    }

    if (!reportData) {
        return (
            <div className="p-6">
                <EmptyState
                    iconName="BarChart3"
                    title="No Report Data Available"
                    message="Execute tests and report issues to generate reports"
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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold text-surface-900">Reports</h1>
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-surface-700">Time Range:</label>
                        <Select
                            value={selectedTimeRange}
                            onChange={(e) => setSelectedTimeRange(e.target.value)}
                            options={[
                                { value: '7', label: 'Last 7 days' },
                                { value: '30', label: 'Last 30 days' },
                                { value: '90', label: 'Last 90 days' },
                                { value: '365', label: 'Last year' }
                            ]}
                        />
                    </div>
                </div>

                <ReportSummaryCards reportData={reportData} />
                <ReportChartsSection reportData={reportData} />
                <DetailedReportMetrics reportData={reportData} />
            </motion.div>
        </div>
    );
};

export default ReportsPage;