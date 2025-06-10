import React from 'react';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import { motion } from 'framer-motion';

const FilterControls = ({ filters, setFilters, clearFilters, filterOptions, searchPlaceholder }) => {
    return (
        <div className="bg-white rounded-lg border border-surface-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField
                    label="Search"
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    placeholder={searchPlaceholder}
                />
                {filterOptions.priority && (
                    <FormField
                        label="Priority"
                        type="select"
                        value={filters.priority}
                        onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                        options={[
                            { value: 'all', label: 'All Priorities' },
                            { value: 'high', label: 'High' },
                            { value: 'medium', label: 'Medium' },
                            { value: 'low', label: 'Low' }
                        ]}
                    />
                )}
                {filterOptions.status && (
                    <FormField
                        label="Status"
                        type="select"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        options={[
                            { value: 'all', label: 'All Status' },
                            ...(filterOptions.status === 'testCase' ? [
                                { value: 'passed', label: 'Passed' },
                                { value: 'failed', label: 'Failed' },
                                { value: 'blocked', label: 'Blocked' },
                                { value: 'not_run', label: 'Not Run' }
                            ] : []),
                            ...(filterOptions.status === 'issue' ? [
                                { value: 'new', label: 'New' },
                                { value: 'in_progress', label: 'In Progress' },
                                { value: 'fixed', label: 'Fixed' },
                                { value: 'verified', label: 'Verified' },
                                { value: 'closed', label: 'Closed' }
                            ] : [])
                        ]}
                    />
                )}
                {filterOptions.severity && (
                    <FormField
                        label="Severity"
                        type="select"
                        value={filters.severity}
                        onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                        options={[
                            { value: 'all', label: 'All Severities' },
                            { value: 'critical', label: 'Critical' },
                            { value: 'high', label: 'High' },
                            { value: 'medium', label: 'Medium' },
                            { value: 'low', label: 'Low' }
                        ]}
                    />
                )}
                <div className="flex items-end">
                    <Button variant="secondary" onClick={clearFilters}>
                        Clear Filters
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FilterControls;