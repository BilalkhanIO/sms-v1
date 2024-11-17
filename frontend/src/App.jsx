import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppRoutes from './routes/AppRoutes';
import { routerConfig } from './routes/router.config';

const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter future={routerConfig.future}>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App; 