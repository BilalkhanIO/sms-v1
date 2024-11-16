import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppRoutes from './routes/AppRoutes';
import store from './redux/store';
import { routerConfig } from './routes/router.config';

const App = () => {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <BrowserRouter future={routerConfig.future}>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </Provider>
  );
};

export default App; 