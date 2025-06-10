import React from 'react';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const TestStepInput = ({ step, index, updateStep, removeStep, isRemovable }) => {
    return (
        <div className="flex items-center space-x-2">
            <span className="text-sm text-surface-500 w-8">{index + 1}.</span>
            <Input
                type="text"
                value={step}
                onChange={(e) => updateStep(index, e.target.value)}
                placeholder="Enter test step"
            />
            {isRemovable && (
                <Button
                    type="button"
                    variant="text"
                    icon={ApperIcon}
                    iconName="Trash2"
                    iconSize={16}
                    onClick={() => removeStep(index)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                />
            )}
        </div>
    );
};

export default TestStepInput;