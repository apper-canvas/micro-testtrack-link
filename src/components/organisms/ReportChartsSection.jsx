import React from 'react';
import Chart from 'react-apexcharts';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import { motion } from 'framer-motion';

const ReportChartsSection = ({ reportData }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card
                motionProps={{
                    initial: { opacity: 0, x: -20 },
                    animate: { opacity: 1, x: 0 },
                    transition: { duration: 0.4, delay: 0.3 }
                }}
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
            </Card>

            <Card
                motionProps={{
                    initial: { opacity: 0, x: 20 },
                    animate: { opacity: 1, x: 0 },
                    transition: { duration: 0.4, delay: 0.4 }
                }}
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
            </Card>
        </div>
    );
};

export default ReportChartsSection;