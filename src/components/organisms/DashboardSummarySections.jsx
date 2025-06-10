import React from 'react';
import Card from '@/components/atoms/Card';
import { motion } from 'framer-motion';

const DashboardSummarySections = ({ metrics }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card
                motionProps={{
                    initial: { opacity: 0, x: -20 },
                    animate: { opacity: 1, x: 0 },
                    transition: { duration: 0.4, delay: 0.3 }
                }}
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
            </Card>

            <Card
                motionProps={{
                    initial: { opacity: 0, x: 20 },
                    animate: { opacity: 1, x: 0 },
                    transition: { duration: 0.4, delay: 0.4 }
                }}
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
            </Card>
        </div>
    );
};

export default DashboardSummarySections;