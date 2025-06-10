import React from 'react';

const Select = ({ className = '', options, ...props }) => {
    return (
        <select
            className={`w-full px-3 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
            {...props}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value} className="text-surface-900">
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default Select;