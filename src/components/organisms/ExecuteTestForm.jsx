import React, { useState } from 'react';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';

const ExecuteTestForm = ({ testCase, onSubmit, onCancel }) => {
    const [form, setForm] = useState({
        status: 'passed',
        notes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card className="bg-surface-50 p-4 mb-6" clickable={false}>
                <h3 className="font-semibold text-surface-900 mb-2">{testCase.title}</h3>
                <p className="text-surface-600 mb-3 break-words">{testCase.description}</p>

                <div className="mb-3">
                    <h4 className="font-medium text-surface-900 mb-2">Test Steps:</h4>
                    <ol className="space-y-1">
                        {testCase.steps.map((step, index) => (
                            <li key={index} className="text-sm text-surface-700 break-words">
                                {index + 1}. {step}
                            </li>
                        ))}
                    </ol>
                </div>

                <div>
                    <h4 className="font-medium text-surface-900 mb-1">Expected Result:</h4>
                    <p className="text-sm text-surface-700 break-words">{testCase.expectedResult}</p>
                </div>
            </Card>

            <div className="space-y-4">
                <FormField
                    label="Test Result"
                    name="status"
                    type="select"
                    value={form.status}
                    onChange={handleChange}
                    options={[
                        { value: 'passed', label: 'Passed' },
                        { value: 'failed', label: 'Failed' },
                        { value: 'blocked', label: 'Blocked' }
                    ]}
                    required
                />
                <FormField
                    label="Notes"
                    name="notes"
                    type="textarea"
                    rows={4}
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Add any notes about the test execution (optional)"
                />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Submit Result
                </Button>
            </div>
        </form>
    );
};

export default ExecuteTestForm;