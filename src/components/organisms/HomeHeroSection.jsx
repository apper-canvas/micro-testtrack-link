import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const HomeHeroSection = () => {
    return (
        <div className="bg-white border-b border-surface-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-primary/10 rounded-2xl">
                            <ApperIcon name="TestTube2" className="w-16 h-16 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-surface-900 mb-4">
                        TestTrack Pro
                    </h1>
                    <p className="text-xl text-surface-600 mb-8 max-w-2xl mx-auto">
                        Streamline your QA workflow with comprehensive test case management and issue tracking
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default HomeHeroSection;