import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';

const EmptyState = ({ iconName, title, message, actionText, onAction, className = '' }) => {
    return (
        <div className={`bg-white rounded-lg border border-surface-200 p-8 text-center ${className}`}>
            <ApperIcon name={iconName} className="w-12 h-12 text-surface-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900 mb-2">{title}</h3>
            <p className="text-surface-600 mb-4">{message}</p>
            {onAction && (
                <Button onClick={onAction}>{actionText}</Button>
            )}
        </div>
    );
};

export default EmptyState;