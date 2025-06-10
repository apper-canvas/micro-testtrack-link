import React, { useState } from 'react';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';

const ReportIssueForm = ({ onSubmit, onCancel }) => {
    const [form, setForm] = useState({
        title: '',
        description: '',
        severity: 'medium',
        category: '',
        reproductionSteps: ''
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
            <div className="space-y-4">
                <FormField
                    label="Issue Title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter a clear, descriptive title"
                    required
                />
                <FormField
                    label="Description"
                    name="description"
                    type="textarea"
                    rows={4}
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the issue in detail"
                    required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        label="Severity"
                        name="severity"
                        type="select"
                        value={form.severity}
                        onChange={handleChange}
                        options={[
                            { value: 'low', label: 'Low' },
                            { value: 'medium', label: 'Medium' },
                            { value: 'high', label: 'High' },
                            { value: 'critical', label: 'Critical' }
                        ]}
                    />
                    <FormField
                        label="Category"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        placeholder="e.g., UI, Performance, API"
                    />
                </div>
                <FormField
                    label="Reproduction Steps"
                    name="reproductionSteps"
                    type="textarea"
                    rows={4}
                    value={form.reproductionSteps}
                    onChange={handleChange}
                    placeholder="Step-by-step instructions to reproduce the issue"
                />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700">
                    Report Issue
                </Button>
            </div>
        </form>
    );
};

export default ReportIssueForm;