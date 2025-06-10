import React from 'react';
import TestCaseCard from '@/components/molecules/TestCaseCard';
import EmptyState from '@/components/atoms/EmptyState';
import ApperIcon from '@/components/ApperIcon';
import { motion } from 'framer-motion';

const TestCasesList = ({ testCases, filteredTestCases, onExecuteTest, onShowCreateForm }) => {
    if (filteredTestCases.length === 0) {
        return (
            <EmptyState
                iconName="FileCheck"
                title={testCases.length === 0 ? 'No Test Cases Yet' : 'No Test Cases Found'}
                message={
                    testCases.length === 0
                        ? 'Create your first test case to get started'
                        : 'Try adjusting your filters to find test cases'
                }
                actionText={testCases.length === 0 ? 'Create Test Case' : null}
                onAction={testCases.length === 0 ? onShowCreateForm : null}
            />
        );
    }

    return (
        <div className="space-y-4">
            {filteredTestCases.map((testCase, index) => (
                <TestCaseCard
                    key={testCase.id}
                    testCase={testCase}
                    index={index}
                    onExecuteTest={onExecuteTest}
                />
            ))}
        </div>
    );
};

export default TestCasesList;