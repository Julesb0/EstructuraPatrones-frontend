import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './common/LoadingSpinner';

interface AuthWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children, requireAuth = false }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner message="Verificando autenticación..." size="lg" />
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AuthWrapper;