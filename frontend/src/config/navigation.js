import {
  HomeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
  ClipboardListIcon,
  ChartBarIcon,
  LibraryIcon,
  BellIcon,
  CogIcon,
} from '@heroicons/react/24/outline';
import { PERMISSIONS } from '../utils/permissions';

export const navigationConfig = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: HomeIcon,
    permissions: [], // Empty array means accessible to all authenticated users
  },
  {
    title: 'User Management',
    path: '/users',
    icon: UserGroupIcon,
    permissions: ['MANAGE_USERS'],
    children: [
      {
        title: 'All Users',
        path: '/users/list',
        permissions: ['MANAGE_USERS'],
      },
      {
        title: 'Role Management',
        path: '/users/roles',
        permissions: ['MANAGE_ROLES'],
      },
    ],
  },
  {
    title: 'Teachers',
    path: '/teachers',
    icon: AcademicCapIcon,
    permissions: ['MANAGE_TEACHERS', 'VIEW_TEACHERS'],
    children: [
      {
        title: 'All Teachers',
        path: '/teachers/list',
        permissions: ['VIEW_TEACHERS'],
      },
      {
        title: 'Assignments',
        path: '/teachers/assignments',
        permissions: ['MANAGE_TEACHERS'],
      },
      {
        title: 'Attendance',
        path: '/teachers/attendance',
        permissions: ['MANAGE_ATTENDANCE'],
      },
    ],
  },
  {
    title: 'Students',
    path: '/students',
    icon: BookOpenIcon,
    permissions: ['MANAGE_STUDENTS', 'VIEW_STUDENTS'],
    children: [
      {
        title: 'All Students',
        path: '/students/list',
        permissions: ['VIEW_STUDENTS'],
      },
      {
        title: 'Enrollment',
        path: '/students/enrollment',
        permissions: ['MANAGE_STUDENTS'],
      },
      {
        title: 'Attendance',
        path: '/students/attendance',
        permissions: ['MANAGE_ATTENDANCE'],
      },
    ],
  },
  {
    title: 'Academics',
    path: '/academics',
    icon: ClipboardListIcon,
    permissions: ['MANAGE_CLASSES', 'VIEW_CLASSES'],
    children: [
      {
        title: 'Classes',
        path: '/academics/classes',
        permissions: ['MANAGE_CLASSES'],
      },
      {
        title: 'Subjects',
        path: '/academics/subjects',
        permissions: ['MANAGE_SUBJECTS'],
      },
      {
        title: 'Exams',
        path: '/academics/exams',
        permissions: ['MANAGE_EXAMS'],
      },
    ],
  },
  {
    title: 'Finance',
    path: '/finance',
    icon: CurrencyDollarIcon,
    permissions: ['MANAGE_FEES', 'VIEW_FEES'],
    children: [
      {
        title: 'Fee Structure',
        path: '/finance/fee-structure',
        permissions: ['MANAGE_FEES'],
      },
      {
        title: 'Payments',
        path: '/finance/payments',
        permissions: ['VIEW_FEES'],
      },
      {
        title: 'Reports',
        path: '/finance/reports',
        permissions: ['VIEW_FEES'],
      },
    ],
  },
  {
    title: 'Reports',
    path: '/reports',
    icon: ChartBarIcon,
    permissions: ['VIEW_REPORTS'],
  },
  {
    title: 'Library',
    path: '/library',
    icon: LibraryIcon,
    permissions: ['MANAGE_LIBRARY', 'VIEW_LIBRARY'],
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: CogIcon,
    permissions: ['MANAGE_SETTINGS'],
  },
]; 