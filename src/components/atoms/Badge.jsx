import React from 'react';
import { getPriorityColor, getStatusColor, getSeverityColor, formatStatus } from '@/utils/helpers';

const Badge = ({ type, value, className = '' }) => {
    let colorClass = '';
    let displayText = value;

    if (type === 'priority') {
        colorClass = getPriorityColor(value);
        displayText = `${value.charAt(0).toUpperCase() + value.slice(1)} Priority`;
    } else if (type === 'status') {
        colorClass = getStatusColor(value);
        displayText = formatStatus(value);
    } else if (type === 'severity') {
        colorClass = getSeverityColor(value);
        displayText = `${value.charAt(0).toUpperCase() + value.slice(1)} Severity`;
    } else {
        colorClass = 'bg-surface-100 text-surface-800'; // Default
    }

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass} ${className}`}>
            {displayText}
        </span>
    );
};

export default Badge;