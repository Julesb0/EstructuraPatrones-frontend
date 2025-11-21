import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import SocialRegister from './pages/SocialRegister';
import DashboardUltra from './pages/DashboardUltra';
import ProfilePage from './pages/ProfilePage';
import ChatbotPage from './pages/ChatbotPage';
import AuthCallback from './pages/AuthCallback';
import ModernHeader from './components/layout/ModernHeader';
import TestTailwind from './pages/TestTailwind';

function App() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/login';
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/test-tailwind" element={<TestTailwind />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-social" element={<SocialRegister />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout handleLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardUltra />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="chatbot" element={<ChatbotPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  return isAuthenticated() ? children : <Navigate to="/login" replace />;
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