import React, { useState } from 'react';
import FormField from '@/components/molecules/FormField';
import TestStepInput from '@/components/molecules/TestStepInput';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const CreateTestCaseForm = ({ onSubmit, onCancel }) => {
    const [form, setForm] = useState({
        title: '',
        description: '',
        steps: [''],
        expectedResult: '',
        priority: 'medium'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const addStep = () => {
        setForm(prev => ({
            ...prev,
            steps: [...prev.steps, '']
        }));
    };

    const removeStep = (index) => {
        setForm(prev => ({
            ...prev,
            steps: prev.steps.filter((_, i) => i !== index)
        }));
    };

    const updateStep = (index, value) => {
        const newSteps = [...form.steps];
        newSteps[index] = value;
        setForm(prev => ({
            ...prev,
            steps: newSteps
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...form,
            steps: form.steps.filter(step => step.trim()) // Clean empty steps
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-4">
                <FormField
                    label="Title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter test case title"
                    required
                />
                <FormField
                    label="Description"
                    name="description"
                    type="textarea"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Enter test case description"
                    required
                />
                <FormField
                    label="Priority"
                    name="priority"
                    type="select"
                    value={form.priority}
                    onChange={handleChange}
                    options={[
                        { value: 'low', label: 'Low' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'high', label: 'High' }
                    ]}
                />
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-surface-700">
                            Test Steps <span className="text-red-500">*</span>
                        </label>
                        <Button
                            type="button"
                            variant="text"
                            icon={ApperIcon}
                            iconName="Plus"
                            iconSize={16}
                            onClick={addStep}
                            className="text-primary hover:text-primary/80 text-sm"
                        >
                            Add Step
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {form.steps.map((step, index) => (
                            <TestStepInput
                                key={index}
                                step={step}
                                index={index}
                                updateStep={updateStep}
                                removeStep={removeStep}
                                isRemovable={form.steps.length > 1}
                            />
                        ))}
                    </div>
                </div>
                <FormField
                    label="Expected Result"
                    name="expectedResult"
                    type="textarea"
                    value={form.expectedResult}
                    onChange={handleChange}
                    placeholder="Enter expected result"
                    required
                />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">
                    Create Test Case
                </Button>
            </div>
        </form>
    );
};

export default CreateTestCaseForm;