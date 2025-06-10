import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { formatStatus } from '@/utils/helpers';

const TestCaseCard = ({ testCase, index, onExecuteTest }) => {
    return (
        <motion.div
            key={testCase.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white rounded-lg border border-surface-200 p-6 hover:shadow-md transition-shadow"
        >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-surface-900 break-words">
                            {testCase.title}
                        </h3>
                    </div>
                    <p className="text-surface-600 mb-3 break-words">
                        {testCase.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge type="priority" value={testCase.priority} />
                        <Badge type="status" value={testCase.lastRunStatus || 'not_run'} />
                    </div>
                    <p className="text-xs text-surface-500">
                        Created: {new Date(testCase.createdAt).toLocaleDateString()}
                        {testCase.updatedAt !== testCase.createdAt && (
                            <span> • Updated: {new Date(testCase.updatedAt).toLocaleDateString()}</span>
                        )}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 lg:ml-4">
                    <Button
                        icon={ApperIcon}
                        iconName="Play"
                        iconSize={16}
                        onClick={() => onExecuteTest(testCase)}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        Execute
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default TestCaseCard;