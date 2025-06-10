import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const MetricCard = ({ title, value, icon, color, bgColor, motionProps }) => {
    return (
        <Card clickable motionProps={motionProps}>
            <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-600 mb-1 break-words">
                        {title}
                    </p>
                    <p className={`text-2xl font-bold ${color}`}>
                        {value}
                    </p>
                </div>
                <div className={`p-3 rounded-lg ${bgColor}`}>
                    <ApperIcon name={icon} className={`w-6 h-6 ${color}`} />
                </div>
            </div>
        </Card>
    );
};

export default MetricCard;