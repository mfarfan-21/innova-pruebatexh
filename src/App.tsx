import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './presentation/pages/Home';
import { Login } from './presentation/pages/Login';
import { OCR } from './presentation/pages/OCR';
import { Chatbot } from './presentation/pages/Chatbot';
import { AuthProvider, useAuth } from './application/services/AuthContext';
import { LanguageProvider } from './application/services/LanguageContext';
import { ErrorBoundary } from './presentation/components/ErrorBoundary';
import { LoadingSpinner } from './presentation/components/LoadingSpinner';
import './App.css';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullscreen message="Verificando autenticación..." />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Componente para rutas públicas (login)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullscreen message="Verificando autenticación..." />;
  }

  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <ErrorBoundary>
                <Login />
              </ErrorBoundary>
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <Home />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ocr"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <OCR />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chatbot"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <Chatbot />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
