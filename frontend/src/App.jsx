// src/App.jsx
import Routes from "./routes/Router";
import ErrorBoundary from "./components/common/ErrorBoundary";
import AuthProvider from "./components/auth/AuthProvider";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
