import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const QuickActionCard = ({ title, description, icon, color, action, motionProps }) => {
    return (
        <Card clickable motionProps={motionProps} onClick={action} className="transition-all duration-200">
            <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${color}`}>
                    <ApperIcon name={icon} className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-surface-900 mb-1">
                        {title}
                    </h3>
                    <p className="text-surface-600 text-sm break-words">
                        {description}
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default QuickActionCard;