import React from 'react';

const TextArea = ({ className = '', rows = 3, ...props }) => {
    return (
        <textarea
            rows={rows}
            className={`w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
            {...props}
        />
    );
};

export default TextArea;