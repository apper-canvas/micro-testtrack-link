import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', motionProps = {}, clickable = false, ...props }) => {
    const baseStyles = "bg-white rounded-lg border border-surface-200 p-6";
    const interactiveStyles = clickable ? "hover:shadow-md transition-shadow cursor-pointer" : "";

    const Component = Object.keys(motionProps).length > 0 ? motion.div : 'div';

    return (
        <Component className={`${baseStyles} ${interactiveStyles} ${className}`} {...motionProps} {...props}>
            {children}
        </Component>
    );
};

export default Card;