import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { issueService } from '@/services';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import EmptyState from '@/components/atoms/EmptyState';
import FilterControls from '@/components/molecules/FilterControls';
import Modal from '@/components/molecules/Modal';
import ReportIssueForm from '@/components/organisms/ReportIssueForm';
import IssueDetailView from '@/components/organisms/IssueDetailView';
import IssuesList from '@/components/organisms/IssuesList';

const IssuesPage = () => {
    const [issues, setIssues] = useState([]);
    const [filteredIssues, setFilteredIssues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [filters, setFilters] = useState({
        severity: 'all',
        status: 'all',
        search: ''
    });

    useEffect(() => {
        loadIssues();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [issues, filters]);

    const loadIssues = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await issueService.getAll();
            setIssues(data);
        } catch (err) {
            setError(err.message || 'Failed to load issues');
            toast.error('Failed to load issues');
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...issues];

        if (filters.severity !== 'all') {
            filtered = filtered.filter(issue => issue.severity === filters.severity);
        }

        if (filters.status !== 'all') {
            filtered = filtered.filter(issue => issue.status === filters.status);
        }

        if (filters.search.trim()) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(issue =>
                issue.title.toLowerCase().includes(searchTerm) ||
                issue.description.toLowerCase().includes(searchTerm) ||
                issue.category.toLowerCase().includes(searchTerm)
            );
        }

        setFilteredIssues(filtered);
    };

    const clearFilters = () => {
        setFilters({ severity: 'all', status: 'all', search: '' });
    };

    const handleCreateIssue = async (formData) => {
        try {
            const newIssue = await issueService.create(formData);
            setIssues([...issues, newIssue]);
            setShowCreateForm(false);
            toast.success('Issue reported successfully');
        } catch (err) {
            toast.error('Failed to create issue');
        }
    };

    const handleStatusChange = async (issueId, newStatus) => {
        try {
            const updatedIssue = await issueService.update(issueId, {
                status: newStatus,
                resolvedAt: newStatus === 'closed' ? new Date().toISOString() : null
            });

            setIssues(issues.map(issue =>
                issue.id === issueId ? updatedIssue : issue
            ));

            toast.success(`Issue status updated to ${newStatus}`);
        } catch (err) {
            toast.error('Failed to update issue status');
        }
    };

    const handleViewDetails = (issue) => {
        setSelectedIssue(issue);
        setShowDetailModal(true);
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="h-8 bg-surface-200 rounded w-24 animate-pulse"></div>
                    <div className="h-10 bg-surface-200 rounded w-32 animate-pulse"></div>
                </div>
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <Card key={i}>
                            <div className="animate-pulse space-y-3">
                                <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                                <div className="h-3 bg-surface-200 rounded w-1/2"></div>
                                <div className="flex space-x-2">
                                    <div className="h-6 bg-surface-200 rounded w-16"></div>
                                    <div className="h-6 bg-surface-200 rounded w-16"></div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <EmptyState
                    iconName="AlertCircle"
                    title="Error Loading Issues"
                    message={error}
                    actionText="Try Again"
                    onAction={loadIssues}
                />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-full overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold text-surface-900">Issues</h1>
                    <Button
                        onClick={() => setShowCreateForm(true)}
                        icon={ApperIcon}
                        iconName="Bug"
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Report Issue
                    </Button>
                </div>

                <FilterControls
                    filters={filters}
                    setFilters={setFilters}
                    clearFilters={clearFilters}
                    filterOptions={{ severity: true, status: 'issue' }}
                    searchPlaceholder="Search issues..."
                />

                <IssuesList
                    issues={issues}
                    filteredIssues={filteredIssues}
                    onStatusChange={handleStatusChange}
                    onViewDetails={handleViewDetails}
                    onShowCreateForm={() => setShowCreateForm(true)}
                />
            </motion.div>

            <Modal
                isOpen={showCreateForm}
                onClose={() => setShowCreateForm(false)}
                title="Report Issue"
            >
                <ReportIssueForm
                    onSubmit={handleCreateIssue}
                    onCancel={() => setShowCreateForm(false)}
                />
            </Modal>

            <Modal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                title="Issue Details"
            >
                {selectedIssue && (
                    <IssueDetailView issue={selectedIssue} />
                )}
            </Modal>
        </div>
    );
};

export default IssuesPage;