import React from 'react';
import IssueCard from '@/components/molecules/IssueCard';
import EmptyState from '@/components/atoms/EmptyState';
import ApperIcon from '@/components/ApperIcon';

const IssuesList = ({ issues, filteredIssues, onStatusChange, onViewDetails, onShowCreateForm }) => {
    if (filteredIssues.length === 0) {
        return (
            <EmptyState
                iconName="Bug"
                title={issues.length === 0 ? 'No Issues Yet' : 'No Issues Found'}
                message={
                    issues.length === 0
                        ? 'Report your first issue to get started'
                        : 'Try adjusting your filters to find issues'
                }
                actionText={issues.length === 0 ? 'Report Issue' : null}
                onAction={issues.length === 0 ? onShowCreateForm : null}
            />
        );
    }

    return (
        <div className="space-y-4">
            {filteredIssues.map((issue, index) => (
                <IssueCard
                    key={issue.id}
                    issue={issue}
                    index={index}
                    onStatusChange={onStatusChange}
                    onViewDetails={onViewDetails}
                />
            ))}
        </div>
    );
};

export default IssuesList;