import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { testCaseService, testRunService } from '@/services';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import EmptyState from '@/components/atoms/EmptyState';
import FilterControls from '@/components/molecules/FilterControls';
import Modal from '@/components/molecules/Modal';
import CreateTestCaseForm from '@/components/organisms/CreateTestCaseForm';
import ExecuteTestForm from '@/components/organisms/ExecuteTestForm';
import TestCasesList from '@/components/organisms/TestCasesList';

const TestCasesPage = () => {
    const [testCases, setTestCases] = useState([]);
    const [filteredTestCases, setFilteredTestCases] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showExecuteModal, setShowExecuteModal] = useState(false);
    const [selectedTestCase, setSelectedTestCase] = useState(null);
    const [filters, setFilters] = useState({
        priority: 'all',
        status: 'all',
        search: ''
    });

    useEffect(() => {
        loadTestCases();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [testCases, filters]);

    const loadTestCases = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await testCaseService.getAll();
            setTestCases(data);
        } catch (err) {
            setError(err.message || 'Failed to load test cases');
            toast.error('Failed to load test cases');
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...testCases];

        if (filters.priority !== 'all') {
            filtered = filtered.filter(tc => tc.priority === filters.priority);
        }

        if (filters.status !== 'all') {
            filtered = filtered.filter(tc => tc.lastRunStatus === filters.status);
        }

        if (filters.search.trim()) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(tc =>
                tc.title.toLowerCase().includes(searchTerm) ||
                tc.description.toLowerCase().includes(searchTerm)
            );
        }

        setFilteredTestCases(filtered);
    };

    const clearFilters = () => {
        setFilters({ priority: 'all', status: 'all', search: '' });
    };

    const handleCreateTestCase = async (formData) => {
        try {
            const newTestCase = await testCaseService.create(formData);
            setTestCases([...testCases, newTestCase]);
            setShowCreateForm(false);
            toast.success('Test case created successfully');
        } catch (err) {
            toast.error('Failed to create test case');
        }
    };

    const handleExecuteTest = async (formData) => {
        try {
            const testRun = await testRunService.create({
                testCaseId: selectedTestCase.id,
                status: formData.status,
                notes: formData.notes,
                executedBy: 'Current User' // Placeholder, ideally from auth context
            });

            const updatedTestCase = await testCaseService.update(selectedTestCase.id, {
                lastRunStatus: formData.status
            });

            setTestCases(testCases.map(tc =>
                tc.id === selectedTestCase.id ? updatedTestCase : tc
            ));

            setShowExecuteModal(false);
            setSelectedTestCase(null);
            toast.success('Test executed successfully');
        } catch (err) {
            toast.error('Failed to execute test');
        }
    };

    const handleOpenExecuteModal = (testCase) => {
        setSelectedTestCase(testCase);
        setShowExecuteModal(true);
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="h-8 bg-surface-200 rounded w-32 animate-pulse"></div>
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
                    title="Error Loading Test Cases"
                    message={error}
                    actionText="Try Again"
                    onAction={loadTestCases}
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
                    <h1 className="text-2xl font-bold text-surface-900">Test Cases</h1>
                    <Button
                        onClick={() => setShowCreateForm(true)}
                        icon={ApperIcon}
                        iconName="Plus"
                    >
                        Create Test Case
                    </Button>
                </div>

                <FilterControls
                    filters={filters}
                    setFilters={setFilters}
                    clearFilters={clearFilters}
                    filterOptions={{ priority: true, status: 'testCase' }}
                    searchPlaceholder="Search test cases..."
                />

                <TestCasesList
                    testCases={testCases}
                    filteredTestCases={filteredTestCases}
                    onExecuteTest={handleOpenExecuteModal}
                    onShowCreateForm={() => setShowCreateForm(true)}
                />
            </motion.div>

            <Modal
                isOpen={showCreateForm}
                onClose={() => setShowCreateForm(false)}
                title="Create Test Case"
            >
                <CreateTestCaseForm
                    onSubmit={handleCreateTestCase}
                    onCancel={() => setShowCreateForm(false)}
                />
            </Modal>

            <Modal
                isOpen={showExecuteModal}
                onClose={() => setShowExecuteModal(false)}
                title="Execute Test Case"
            >
                {selectedTestCase && (
                    <ExecuteTestForm
                        testCase={selectedTestCase}
                        onSubmit={handleExecuteTest}
                        onCancel={() => setShowExecuteModal(false)}
                    />
                )}
            </Modal>
        </div>
    );
};

export default TestCasesPage;