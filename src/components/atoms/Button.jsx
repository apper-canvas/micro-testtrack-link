import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, className = '', variant = 'primary', icon: Icon, motionProps = {}, ...props }) => {
    const baseStyles = "flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors";
    const variantStyles = {
        primary: "bg-primary text-white hover:bg-primary/90",
        danger: "bg-red-600 text-white hover:bg-red-700",
        secondary: "bg-surface-100 text-surface-700 border border-surface-300 hover:bg-surface-200",
        text: "text-primary hover:text-primary/80"
    };

    return (
        <motion.button
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            {...motionProps}
            {...props}
        >
            {Icon && <Icon size={props.iconSize || 16} />}
            <span>{children}</span>
        </motion.button>
    );
};

export default Button;