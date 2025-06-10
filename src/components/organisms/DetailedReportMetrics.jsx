import React from 'react';
import Card from '@/components/atoms/Card';
import { motion } from 'framer-motion';

const DetailedReportMetrics = ({ reportData }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card
                motionProps={{
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.4, delay: 0.5 }
                }}
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
            </Card>

            <Card
                motionProps={{
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.4, delay: 0.6 }
                }}
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
            </Card>
        </div>
    );
};

export default DetailedReportMetrics;