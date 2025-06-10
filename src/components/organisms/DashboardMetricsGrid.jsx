import React from 'react';
import MetricCard from '@/components/molecules/MetricCard';
import { motion } from 'framer-motion';

const DashboardMetricsGrid = ({ metrics }) => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricCards.map((metric, index) => (
                <MetricCard
                    key={metric.title}
                    title={metric.title}
                    value={metric.value}
                    icon={metric.icon}
                    color={metric.color}
                    bgColor={metric.bgColor}
                    motionProps={{
                        initial: { opacity: 0, y: 20 },
                        animate: { opacity: 1, y: 0 },
                        transition: { duration: 0.4, delay: index * 0.1 }
                    }}
                />
            ))}
        </div>
    );
};

export default DashboardMetricsGrid;