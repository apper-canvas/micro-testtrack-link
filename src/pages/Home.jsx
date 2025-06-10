import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';
import MainFeature from '../components/MainFeature';

const Home = () => {
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
    <div className="min-h-full bg-surface-50">
      {/* Hero Section */}
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

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.action}
                className="bg-white rounded-lg border border-surface-200 p-6 cursor-pointer hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${action.color}`}>
                    <ApperIcon name={action.icon} className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-surface-900 mb-1">
                      {action.title}
                    </h3>
                    <p className="text-surface-600 text-sm break-words">
                      {action.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Feature */}
        <MainFeature />
      </div>
    </div>
  );
};

export default Home;