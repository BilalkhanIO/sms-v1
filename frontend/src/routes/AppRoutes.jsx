import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import LoginPage from '../pages/auth/LoginPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import Layout from '../components/layout/Layout';

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <ProtectedRoute><DashboardPage /></ProtectedRoute>,
        },
        // ... other routes
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPasswordPage />,
    },
    {
      path: "/reset-password/:token",
      element: <ResetPasswordPage />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes; 