import React from 'react';
import { motion } from 'framer-motion';

const ModalOverlay = ({ onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClick}
        />
    );
};

export default ModalOverlay;