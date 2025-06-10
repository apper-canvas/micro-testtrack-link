import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import { motion } from 'framer-motion';

const ActivityItem = ({ activity, index }) => {
    const iconColorClass = activity.type === 'test_execution'
        ? activity.status === 'passed'
            ? 'bg-green-100 text-green-600'
            : 'bg-red-100 text-red-600'
        : 'bg-yellow-100 text-yellow-600';

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex items-center space-x-4 max-w-full"
        >
            <div className={`p-2 rounded-full ${iconColorClass}`}>
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
    );
};

export default ActivityItem;