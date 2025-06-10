import HomePage from '@/components/pages/HomePage';
import DashboardPage from '@/components/pages/DashboardPage';
import TestCasesPage from '@/components/pages/TestCasesPage';
import IssuesPage from '@/components/pages/IssuesPage';
import ReportsPage from '@/components/pages/ReportsPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
component: HomePage
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
component: DashboardPage
  },
  testCases: {
    id: 'testCases',
    label: 'Test Cases',
    path: '/test-cases',
    icon: 'FileCheck',
component: TestCasesPage
  },
  issues: {
    id: 'issues',
    label: 'Issues',
    path: '/issues',
    icon: 'Bug',
component: IssuesPage
  },
  reports: {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: 'BarChart3',
component: ReportsPage
  }
};

export const routeArray = Object.values(routes);