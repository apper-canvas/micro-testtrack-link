import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { getStatusOptions } from '@/utils/helpers';

const IssueCard = ({ issue, index, onStatusChange, onViewDetails }) => {
    const statusOptions = getStatusOptions(issue.status);

    return (
        <motion.div
            key={issue.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white rounded-lg border border-surface-200 p-6 hover:shadow-md transition-shadow"
        >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-surface-900 break-words">
                            {issue.title}
                        </h3>
                    </div>
                    <p className="text-surface-600 mb-3 break-words">
                        {issue.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge type="severity" value={issue.severity} className="border" />
                        <Badge type="status" value={issue.status} />
                        {issue.category && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-surface-100 text-surface-800">
                                {issue.category}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-surface-500">
                        Reported: {new Date(issue.reportedAt).toLocaleDateString()}
                        {issue.resolvedAt && (
                            <span> • Resolved: {new Date(issue.resolvedAt).toLocaleDateString()}</span>
                        )}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 lg:ml-4">
                    <Button
                        variant="secondary"
                        icon={ApperIcon}
                        iconName="Eye"
                        iconSize={16}
                        onClick={() => onViewDetails(issue)}
                    >
                        View
                    </Button>
                    {statusOptions.length > 0 && (
                        <div className="relative">
                            <Select
                                onChange={(e) => onStatusChange(issue.id, e.target.value)}
                                value=""
                                options={[{ value: '', label: 'Update Status' }, ...statusOptions.map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ') }))]}
                                className="px-4 py-2 bg-primary text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
                            />
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default IssueCard;