import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import TestCases from '../pages/TestCases';
import Issues from '../pages/Issues';
import Reports from '../pages/Reports';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  testCases: {
    id: 'testCases',
    label: 'Test Cases',
    path: '/test-cases',
    icon: 'FileCheck',
    component: TestCases
  },
  issues: {
    id: 'issues',
    label: 'Issues',
    path: '/issues',
    icon: 'Bug',
    component: Issues
  },
  reports: {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: 'BarChart3',
    component: Reports
  }
};

export const routeArray = Object.values(routes);