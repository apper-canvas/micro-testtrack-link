import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './components/ApperIcon';
import { routes } from './config/routes';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const mainNavItems = [
    routes.dashboard,
    routes.testCases,
    routes.issues,
    routes.reports
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-surface-50">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-surface-200 px-4 lg:px-6 z-40">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2">
            <ApperIcon name="TestTube2" className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-surface-900">TestTrack Pro</span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors
                  ${isActive 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-surface-600 hover:text-surface-900'
                  }`
                }
              >
                <ApperIcon name={item.icon} size={16} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Global Search */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search test cases, issues..."
                className="pl-10 pr-4 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-64"
              />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-surface-600 hover:bg-surface-100"
          >
            <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-surface-200 py-4"
            >
              <nav className="space-y-2">
                {mainNavItems.map((item) => (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors
                      ${isActive 
                        ? 'text-primary bg-primary/5' 
                        : 'text-surface-600 hover:text-surface-900 hover:bg-surface-50'
                      }`
                    }
                  >
                    <ApperIcon name={item.icon} size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
              
              {/* Mobile Search */}
              <div className="px-4 pt-4 border-t border-surface-200 mt-4">
                <div className="relative">
                  <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-full overflow-hidden"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;