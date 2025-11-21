import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import SocialRegister from './pages/SocialRegister';
import DashboardUltra from './pages/DashboardUltra';
import ProfilePage from './pages/ProfilePage';
import PlansPage from './pages/PlansPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ChatbotPage from './pages/ChatbotPage';
import AuthCallback from './pages/AuthCallback';
import ModernHeader from './components/layout/ModernHeader';
import TestTailwind from './pages/TestTailwind';
import TestPage from './pages/TestPage';
import LoadingSpinner from './components/common/LoadingSpinner';
import { useAuth } from './contexts/AuthContext';
import { PUBLIC_ACCESS_CONFIG } from './config/publicAccess';

function App() {
  const { logout, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner message="Verificando autenticación..." size="lg" />
      </div>
    );
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/test-tailwind" element={<TestTailwind />} />
        <Route path="/test-auth" element={<TestPage />} />
        
        {/* Rutas públicas */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />} />
        <Route path="/register-social" element={<SocialRegister />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* Rutas protegidas - Acceso público al dashboard habilitado */}
        <Route 
          path="/dashboard" 
          element={
            PUBLIC_ACCESS_CONFIG.enablePublicAccess || isAuthenticated ? (
              <Layout handleLogout={logout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<DashboardUltra />} />
          <Route path="plans" element={<PlansPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="chatbot" element={<ChatbotPage />} />
        </Route>
        
        {/* Ruta raíz - Redirigir directamente al dashboard si el acceso público está habilitado */}
        <Route 
          path="/" 
          element={
            PUBLIC_ACCESS_CONFIG.enablePublicAccess || isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </div>
  );
}

function Layout({ handleLogout }: { handleLogout: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <ModernHeader handleLogout={handleLogout} />
      <div className="pt-16">
        <Outlet />
      </div>
    </div>
  );
}

export default App;