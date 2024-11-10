import { ToastProvider } from './components/common/ToastContext';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App; 