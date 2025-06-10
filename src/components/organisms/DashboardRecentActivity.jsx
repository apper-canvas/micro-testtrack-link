import React from 'react';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import ActivityItem from '@/components/molecules/ActivityItem';
import { motion } from 'framer-motion';

const DashboardRecentActivity = ({ recentActivity }) => {
    return (
        <Card
            motionProps={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.4, delay: 0.5 }
            }}
        >
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Recent Activity</h3>
            {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                    <ApperIcon name="Activity" className="w-12 h-12 text-surface-300 mx-auto mb-4" />
                    <p className="text-surface-600">No recent activity</p>
                </div>
            ) : (
                <div className="space-y-4 max-w-full overflow-hidden">
                    {recentActivity.map((activity, index) => (
                        <ActivityItem key={activity.id} activity={activity} index={index} />
                    ))}
                </div>
            )}
        </Card>
    );
};

export default DashboardRecentActivity;