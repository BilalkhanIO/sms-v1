import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import AppRoutes from './routes/AppRoutes';
import { ToastProvider } from './components/common/ToastContext';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ToastProvider>
          <div className="min-h-screen bg-gray-50">
            <AppRoutes />
          </div>
        </ToastProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App; 