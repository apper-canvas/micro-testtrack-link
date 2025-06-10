import React from 'react';
import { motion } from 'framer-motion';
import QuickActionCard from '@/components/molecules/QuickActionCard';
import { useNavigate } from 'react-router-dom';

const HomeQuickActionsSection = () => {
    const navigate = useNavigate();

    const quickActions = [
        {
            title: 'Create Test Case',
            description: 'Start building comprehensive test scenarios',
            icon: 'FilePlus',
            color: 'bg-blue-500',
            action: () => navigate('/test-cases')
        },
        {
            title: 'Report Issue',
            description: 'Document bugs and track resolution',
            icon: 'AlertTriangle',
            color: 'bg-red-500',
            action: () => navigate('/issues')
        },
        {
            title: 'View Dashboard',
            description: 'Monitor testing progress and metrics',
            icon: 'BarChart3',
            color: 'bg-green-500',
            action: () => navigate('/dashboard')
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
        >
            <h2 className="text-2xl font-bold text-surface-900 mb-8 text-center">
                Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quickActions.map((action, index) => (
                    <QuickActionCard
                        key={action.title}
                        title={action.title}
                        description={action.description}
                        icon={action.icon}
                        color={action.color}
                        action={action.action}
                        motionProps={{
                            initial: { opacity: 0, y: 20 },
                            animate: { opacity: 1, y: 0 },
                            transition: { duration: 0.4, delay: 0.1 * index },
                            whileHover: { scale: 1.02 },
                            whileTap: { scale: 0.98 }
                        }}
                    />
                ))}
            </div>
        </motion.div>
    );
};

export default HomeQuickActionsSection;