import React from 'react';
import MetricCard from '@/components/molecules/MetricCard';
import { motion } from 'framer-motion';

const ReportSummaryCards = ({ reportData }) => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {summaryCards.map((card, index) => (
                <MetricCard
                    key={card.title}
                    title={card.title}
                    value={card.value}
                    icon={card.icon}
                    color={card.color}
                    bgColor={card.bgColor}
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

export default ReportSummaryCards;