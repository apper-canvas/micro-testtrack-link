import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ModalOverlay from '@/components/atoms/ModalOverlay';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <ModalOverlay onClick={onClose} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-surface-900">{title}</h2>
                                    <Button
                                        type="button"
                                        variant="text"
                                        onClick={onClose}
                                        icon={ApperIcon}
                                        iconName="X"
                                        iconSize={20}
                                        className="p-2 text-surface-400 hover:text-surface-600 rounded-lg hover:bg-surface-100"
                                    />
                                </div>
                                {children}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Modal;