import React from 'react';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import TextArea from '@/components/atoms/TextArea';

const FormField = ({ label, type = 'text', options, className = '', required, ...props }) => {
    const renderInput = () => {
        switch (type) {
            case 'textarea':
                return <TextArea required={required} {...props} />;
            case 'select':
                return <Select options={options} required={required} {...props} />;
            default:
                return <Input type={type} required={required} {...props} />;
        }
    };

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-surface-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {renderInput()}
        </div>
    );
};

export default FormField;