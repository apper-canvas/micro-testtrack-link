import React from 'react';
import Badge from '@/components/atoms/Badge';

const IssueDetailView = ({ issue }) => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-surface-900 mb-2">
                    {issue.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Badge type="severity" value={issue.severity} className="border" />
                    <Badge type="status" value={issue.status} />
                    {issue.category && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-surface-100 text-surface-800">
                            {issue.category}
                        </span>
                    )}
                </div>
            </div>

            <div>
                <h4 className="font-medium text-surface-900 mb-2">Description</h4>
                <p className="text-surface-700 break-words">{issue.description}</p>
            </div>

            {issue.reproductionSteps && (
                <div>
                    <h4 className="font-medium text-surface-900 mb-2">Reproduction Steps</h4>
                    <p className="text-surface-700 whitespace-pre-wrap break-words">
                        {issue.reproductionSteps}
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h4 className="font-medium text-surface-900 mb-1">Reported</h4>
                    <p className="text-surface-700 text-sm">
                        {new Date(issue.reportedAt).toLocaleDateString()}
                    </p>
                </div>
                {issue.resolvedAt && (
                    <div>
                        <h4 className="font-medium text-surface-900 mb-1">Resolved</h4>
                        <p className="text-surface-700 text-sm">
                            {new Date(issue.resolvedAt).toLocaleDateString()}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IssueDetailView;