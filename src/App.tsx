import React from 'react';
import { Routes, Route, Link, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import AuthCallback from './pages/AuthCallback';

function App() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/login';
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout handleLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<ProfilePage />} />
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
  const username = localStorage.getItem('username') || 'User';

  return (
    <div>
      <nav className="nav">
        <div className="nav-container">
          <Link to="/dashboard" className="nav-brand">Entrepreneur Platform</Link>
          <div className="nav-links">
            <Link to="/dashboard/profile" className="nav-link">Profile</Link>
            <span style={{ color: 'white', marginRight: '20px' }}>Welcome, {username}</span>
            <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              Logout
            </button>
          </div>
        </div>
      </nav>
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
}

export default App;