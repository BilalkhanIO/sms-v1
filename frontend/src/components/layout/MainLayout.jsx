import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { ToastProvider } from '../../contexts/ToastContext';
import ErrorBoundary from '../common/ErrorBoundary';

const MainLayout = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
              <div className="container mx-auto px-6 py-8">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default MainLayout; 